import { type Project } from "../../types/project"
import { type Response } from "../../types/response"
import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  name: string
}

export const postProject = async ({ team, name }: Args) => {
  const response = await apiClient.post<Response<Project>>(
    `/a/${team.slug}/testmap/api/projects/`,
    {
      name
    }
  )

  return response.data.data
}
