import { type Project } from "../../types/project"
import { type Response } from "../../types/response"
import { type Team } from "../../types/team"
import { type Testcase } from "../../types/testcase"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  project: Project
  testsuite: Testsuite
  id: number
  name: string
}

export const putTestcase = async ({
  team,
  id,
  name,
  project,
  testsuite
}: Args) => {
  const response = await apiClient.put<Response<Testcase>>(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/${testsuite.id}/testcases/${id}/`,
    {
      name
    }
  )

  return response.data.data
}
