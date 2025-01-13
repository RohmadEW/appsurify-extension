import { type Pagination } from "../../types/pagination"
import { type Project } from "../../types/project"
import { type PaginatedResponse } from "../../types/response"
import { type Team } from "../../types/team"
import { type Testcase } from "../../types/testcase"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  pagination: Pagination
  team: Team
  project: Project
  testsuite: Testsuite
}

export const getTestcase = async ({
  pagination,
  team,
  project,
  testsuite
}: Args) => {
  const response = await apiClient.get<PaginatedResponse<Testcase>>(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/${testsuite.id}/testcases`,
    {
      params: {
        page: pagination.page
      }
    }
  )

  return response.data
}
