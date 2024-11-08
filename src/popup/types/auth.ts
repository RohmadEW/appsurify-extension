import type { User } from "./user"

export const AUTH_COOKIES = "auth"

export interface AuthType {
  isAuthenticated?: boolean
  token?: string | null
  refresh?: string | null
  user?: User
  isLoading?: boolean
}

export const initialAuthState: AuthType = {}

export interface JWT {
  access: string
  refresh: string
  user: User
}
