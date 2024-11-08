import { type Project } from "../../types/project"
import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  id: number
}

export const getProjectById = async ({ id, team }: Args) => {
  const response = await apiClient.get<Project>(
    `/a/${team.slug}/testmap/api/projects/${id}/`
  )

  return response.data
}
