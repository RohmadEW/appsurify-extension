import { type Pagination } from "../../types/pagination"
import { type Project } from "../../types/project"
import { type PaginatedResponse } from "../../types/response"
import { type Team } from "../../types/team"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  pagination: Pagination
  team: Team
  project: Project
}

export const getTestsuite = async ({ pagination, team, project }: Args) => {
  const response = await apiClient.get<PaginatedResponse<Testsuite>>(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/`,
    {
      params: {
        page: pagination.page
      }
    }
  )

  return response.data
}
