import { useQuery } from "@tanstack/react-query"

import { getTestsuite } from "../../api/testsuite/getTestsuite"
import { type Pagination } from "../../types/pagination"
import { useAppSelector } from "../useStore"

interface Props {
  pagination: Pagination
}

export const useTestsuite = (args: Props) => {
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)

  return useQuery({
    queryKey: ["testsuites", args.pagination, team, project],
    queryFn: () =>
      team && project
        ? getTestsuite({ pagination: args.pagination, team, project })
        : undefined,
    enabled: !!team && !!project
  })
}
