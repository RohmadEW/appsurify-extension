import { useQuery } from "@tanstack/react-query"

import { getProject } from "../../api/project/getProject"
import { type Pagination } from "../../types/pagination"
import { useAppSelector } from "../useStore"

interface Props {
  pagination: Pagination
}

export const useProject = (args: Props) => {
  const { team } = useAppSelector((state) => state.team)

  return useQuery({
    queryKey: ["projects", args.pagination, team],
    queryFn: () =>
      team ? getProject({ pagination: args.pagination, team }) : undefined,
    enabled: !!team
  })
}
