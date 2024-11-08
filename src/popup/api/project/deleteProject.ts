import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  id: number
}

export const deleteProject = async ({ team, id }: Args) => {
  const response = await apiClient.delete(
    `/a/${team.slug}/testmap/api/projects/${id}/`
  )

  return response.data
}
