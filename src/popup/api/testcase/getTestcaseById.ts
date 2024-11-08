import { type Project } from "../../types/project"
import { type Team } from "../../types/team"
import { type Testcase } from "../../types/testcase"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  project: Project
  testsuite: Testsuite
  id: number
}

export const getTestcaseById = async ({
  team,
  project,
  testsuite,
  id
}: Args) => {
  const response = await apiClient.get<Testcase>(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/${testsuite.id}/testcases/${id}/`
  )

  return response.data
}
