import { type Project } from "../../types/project"
import { type Response } from "../../types/response"
import { type Team } from "../../types/team"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  project: Project
  id: number
  name: string
}

export const putTestsuite = async ({ team, id, name, project }: Args) => {
  const response = await apiClient.put<Response<Testsuite>>(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/${id}/`,
    {
      name
    }
  )

  return response.data.data
}
