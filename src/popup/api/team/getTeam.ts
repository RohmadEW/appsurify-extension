import { type PaginatedResponse } from "../../types/response"
import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

export const getTeam = async () => {
  const response =
    await apiClient.get<PaginatedResponse<Team>>("/teams/api/teams/")

  return response.data
}
