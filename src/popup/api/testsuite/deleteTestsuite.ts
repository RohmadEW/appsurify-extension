import { type Project } from "../../types/project"
import { type Team } from "../../types/team"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  project: Project
  id: number
}

export const deleteTestsuite = async ({ team, id, project }: Args) => {
  const response = await apiClient.delete(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/${id}/`
  )

  return response.data
}
