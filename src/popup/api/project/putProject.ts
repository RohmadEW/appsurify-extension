import { type Project } from "../../types/project"
import { type Response } from "../../types/response"
import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  id: number
  name: string
}

export const putProject = async ({ team, id, name }: Args) => {
  const response = await apiClient.put<Response<Project>>(
    `/a/${team.slug}/testmap/api/projects/${id}/`,
    {
      name
    }
  )

  return response.data.data
}
