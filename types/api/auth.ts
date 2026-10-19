export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
}

export interface SignInPayload {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  refreshTokenId: string
}

export interface SignInResult extends AuthTokens {
  loggedInUser: AuthUser
}

export interface RefreshPayload {
  refreshToken: string
  refreshTokenId: string
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
}

export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
}
