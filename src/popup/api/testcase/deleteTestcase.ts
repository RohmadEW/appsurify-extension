import { type Project } from "../../types/project"
import { type Team } from "../../types/team"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  project: Project
  testsuite: Testsuite
  id: number
}

export const deleteTestcase = async ({
  team,
  id,
  project,
  testsuite
}: Args) => {
  const response = await apiClient.delete(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/${testsuite.id}/testcases/${id}/`
  )

  return response.data
}
