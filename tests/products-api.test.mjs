import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import vm from "node:vm"
import ts from "typescript"

// Execute the actual TypeScript helpers with isolated framework/HTTP boundaries.
function setup({ token, status = 200, data = {}, message = "Request failed" } = {}) {
  const requests = []
  const modules = new Map()
  const mocks = {
    react: { cache: fn => fn },
    "next/navigation": { redirect: location => { throw Object.assign(new Error("Redirect"), { location }) } },
    "./config": { API_BASE_URL: "http://backend.test/api/v1", getDefaultHeaders: () => ({ Accept: "application/json" }) },
    "./cookies": {
      getAccessToken: async () => token,
      getRefreshSession: async () => { throw new Error("Must not refresh while rendering") },
      clearAuthCookies: async () => { throw new Error("Must not mutate cookies while rendering") },
    },
  }
  function load(file) {
    const filename = path.resolve(file)
    if (modules.has(filename)) return modules.get(filename).exports
    const loadedModule = { exports: {} }
    modules.set(filename, loadedModule)
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText
    const sandbox = {
      module: loadedModule, exports: loadedModule.exports, URL, Headers,
      require: name => mocks[name] ?? load(path.resolve(path.dirname(filename), name + ".ts")),
      fetch: async (url, options) => {
        requests.push({ url: new URL(url), ...options })
        return new Response(JSON.stringify(status < 400 ? { data } : { message }), { status })
      },
    }
    vm.runInNewContext(code, sandbox, { filename })
    return loadedModule.exports
  }
  return { load, requests }
}

test("guest listing preserves pagination and omits authorization", async () => {
  const data = { products: [], meta: { pagination: { page: 4, totalPages: 0, total: 0 } } }
  const { load, requests } = setup({ data })
  const result = await load("lib/api/public/products.ts").listProducts({ page: 4 })
  assert.equal(JSON.stringify(result), JSON.stringify(data))
  assert.equal(requests[0].headers.has("Authorization"), false)
  assert.equal(requests[0].url.searchParams.get("sortBy"), "createdAt")
  assert.equal(requests[0].url.searchParams.get("sortOrder"), "desc")
})

test("authenticated listing sends all filters, false stock and zero price", async () => {
  const { load, requests } = setup({ token: "access-token", data: { products: [{ id: 12, isWishlisted: true }] } })
  const result = await load("lib/api/public/products.ts").listProducts({ category: "clothing", minPrice: 0, maxPrice: 12.34, inStock: false, sortBy: "price", sortOrder: "asc" })
  assert.equal(result.products[0].isWishlisted, true)
  const request = requests[0]
  assert.equal(request.headers.get("Authorization"), "Bearer access-token")
  assert.equal(request.cache, "no-store")
  assert.equal(request.next, undefined)
  assert.equal(request.url.searchParams.get("minPrice"), "0")
  assert.equal(request.url.searchParams.get("maxPrice"), "12.34")
  assert.equal(request.url.searchParams.get("inStock"), "false")
  assert.equal(request.url.searchParams.get("sortBy"), "price")
})

test("detail uses an encoded slug and returns the product directly", async () => {
  const { load, requests } = setup({ data: { id: 7, isWishlisted: false } })
  const result = await load("lib/api/public/products.ts").getProductBySlug("shirt/blue")
  assert.equal(result.id, 7)
  assert.equal(requests[0].url.pathname, "/api/v1/products/shirt%2Fblue")
})

test("only a 404 becomes product not found; server failures propagate", async () => {
  const missing = setup({ status: 404 })
  assert.equal(await missing.load("lib/api/public/products.ts").getProductBySlugSafe("missing"), null)
  const failed = setup({ status: 500 })
  await assert.rejects(failed.load("lib/api/public/products.ts").getProductBySlugSafe("shirt"), error => error.status === 500)
  await assert.rejects(failed.load("lib/api/public/products.ts").listProducts(), error => error.status === 500)
})

test("invalid tokens trigger sign-in without retrying or falling back to guest", async () => {
  const { load, requests } = setup({ status: 401, token: "expired" })
  await assert.rejects(load("lib/api/public/products.ts").listProducts(), error => error.location === "/login?next=%2Fproducts")
  assert.equal(requests.length, 1)
})

test("validation message arrays remain readable", async () => {
  const { load } = setup({ status: 400, message: ["Invalid price", "Invalid page"] })
  await assert.rejects(load("lib/api/public/products.ts").listProducts(), error => error.status === 400 && error.message === "Invalid price, Invalid page")
})

test("query parsing validates bounds, duplicates, sorting and decimal prices", () => {
  const { load } = setup()
  const { parseProductQuery } = load("lib/api/product-query.ts")
  const result = parseProductQuery({ category: " Clothing ", minPrice: "0", inStock: "false" })
  assert.equal(result.category, "clothing")
  assert.equal(result.minPrice, 0)
  assert.equal(result.inStock, false)
  assert.equal(result.sortBy, "createdAt")
  assert.equal(result.sortOrder, "desc")
  for (const input of [{ page: "0" }, { page: "1.2" }, { limit: "101" }, { minPrice: "1.234" }, { minPrice: "2", maxPrice: "1" }, { sortBy: "sales" }, { sortOrder: "wrong" }, { inStock: "yes" }, { search: ["a", "b"] }]) {
    assert.throws(() => parseProductQuery(input), error => error.status === 400)
  }
})

test("card mapping preserves unknown, true and false wishlist states", () => {
  const { load } = setup()
  const { mapProductToCard } = load("lib/api/mappers.ts")
  for (const isWishlisted of [undefined, true, false]) {
    const card = mapProductToCard({ id: 1, name: "Shirt", slug: "shirt", basePrice: "12.50", isWishlisted })
    assert.equal(card.isWishlisted, isWishlisted)
    assert.equal(card.price, 12.5)
  }
})
