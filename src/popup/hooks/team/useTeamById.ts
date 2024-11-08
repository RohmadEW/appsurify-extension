import { useQuery } from "@tanstack/react-query"

import { getTeamById } from "~popup/api/team/getTeamById"

interface Props {
  id: number
}

export const useTeamById = ({ id }: Props) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeamById({ id })
  })
}
