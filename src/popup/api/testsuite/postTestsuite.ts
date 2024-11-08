import { type Project } from "../../types/project"
import { type Response } from "../../types/response"
import { type Team } from "../../types/team"
import { type Testsuite } from "../../types/testsuite"
import { apiClient } from "../api-client"

interface Args {
  team: Team
  project: Project
  name: string
}

export const postTestsuite = async ({ team, name, project }: Args) => {
  const response = await apiClient.post<Response<Testsuite>>(
    `/a/${team.slug}/testmap/api/projects/${project.id}/testsuites/`,
    {
      name
    }
  )

  return response.data.data
}
