import { type Project } from "../../types/project"
import { type Team } from "../../types/team"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  project: Project
  id: number
}

export const getTestsuiteById = async ({ team, project, id }: Args) => {
  const response = await apiClient.get<Testsuite>(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/${id}/`
  )

  return response.data
}
