import type { eventWithTime } from "@rrweb/types"

import { apiClient } from "../api-client"

export interface PostRecordArgs {
  team_slug: string
  project_name: string
  testsuite_name: string
  testcase_name: string
  testrun_name: string
  rrwebSessionKey: string
  rrwebPageKey: string
  rrwebEvents: eventWithTime[]
}

export const postRecord = async (args: PostRecordArgs) => {
  const response = await apiClient.post<string>(
    `/a/${args.team_slug}/testmap/api/rrweb/record/session`,
    args
  )

  return response.data
}
