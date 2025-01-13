import { apiClient } from "./api-client"

export const postLogout = async () => {
  const response = await apiClient.post<string>("/api/auth/logout")

  return response.data
}
