<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Code quality and reusable implementation

- Inspect the existing implementation, types, API contracts, and project conventions before making changes. Fix the root cause and complete the requested behavior across affected screens.
- Write clear, maintainable, properly typed TypeScript. Use descriptive names and keep functions and components focused on one responsibility. Avoid `any`, unnecessary type assertions, and unexplained hardcoded values.
- Reuse existing components, hooks, utilities, and API helpers. Extract shared logic when multiple callers need the same behavior; avoid copying implementations between pages. Keep abstractions proportional to the actual need.
- Keep API access and response normalization in shared helpers or hooks rather than repeating them inside UI components. Follow the backend's documented response shape and pagination metadata; do not guess API fields or endpoint behavior.
- Share state when multiple components represent the same data. Keep affected views consistent after mutations, navigation, and reloads. Deduplicate concurrent requests and avoid fetching the same collection separately for every card.
- Fetch only the data needed for the feature. Handle paginated results deliberately and never assume the first page contains every item. Avoid unbounded fetching when a targeted API can provide the required data.
- Implement loading, empty, error, and authentication states where relevant. Do not silently treat a failed request as valid empty data or report a mutation as successful before it succeeds. Roll back optimistic updates on failure.
- Make UI behavior match its label and purpose. For example, related-product recommendations should use meaningful relationship criteria, exclude the current product, and use a deliberate fallback when suitable matches are unavailable.
- Preserve accessibility, responsive behavior, and existing functionality. Use semantic controls, accessible names, keyboard support, and visible state indicators.
- Keep changes focused on the user's request. Avoid unrelated refactors, new dependencies, speculative abstractions, and changes to generated files.
- Run TypeScript, relevant lint checks, and tests appropriate to the change. Add meaningful tests for complex or risky behavior; avoid tests that merely duplicate implementation details. Clearly report existing failures and any behavior that could not be verified.
- Before finishing, review the diff for duplication, edge cases, and regressions. Briefly explain what changed, why, and how it was verified.
