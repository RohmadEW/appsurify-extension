import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

export interface GetTeamById {
  id: number
}

export const getTeamById = async ({ id }: GetTeamById) => {
  const response = await apiClient.get<Team>(`/api/teams/${id}`)

  return response.data
}
