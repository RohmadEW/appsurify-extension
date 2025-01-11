import type { JWT } from "../types/auth"
import type { Response } from "../types/response"
import { apiClient } from "./api-client"

export interface PostLoginResponse extends Response {
  jwt: JWT
}

export interface PostLoginArgs {
  email: string
  password: string
}

export const postLogin = async (args: PostLoginArgs) => {
  const response = await apiClient.post<PostLoginResponse>(
    "/api/auth/login",
    args
  )

  return response.data.jwt
}
