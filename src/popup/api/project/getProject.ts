import { type Pagination } from "../../types/pagination"
import { type Project } from "../../types/project"
import { type PaginatedResponse } from "../../types/response"
import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

interface Args {
  pagination: Pagination
  team: Team
}

export const getProject = async ({ pagination, team }: Args) => {
  const response = await apiClient.get<PaginatedResponse<Project>>(
    `/a/${team.slug}/testmap/api/projects/`,
    {
      params: {
        page: pagination.page
      }
    }
  )

  return response.data
}
