import { useQuery } from "@tanstack/react-query"

import { getTestcase } from "../../api/testcase/getTestcase"
import { type Pagination } from "../../types/pagination"
import { useAppSelector } from "../useStore"

interface Props {
  pagination: Pagination
}

export const useTestcase = (args: Props) => {
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)
  const { testsuite } = useAppSelector((state) => state.testsuite)

  return useQuery({
    queryKey: ["testcases", args.pagination, team, project, testsuite],
    queryFn: () =>
      team && project && testsuite
        ? getTestcase({ pagination: args.pagination, team, project, testsuite })
        : undefined,
    enabled: !!team && !!project && !!testsuite
  })
}
