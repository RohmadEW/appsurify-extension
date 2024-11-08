import { useQuery } from "@tanstack/react-query"

import { getTeam } from "../../api/team/getTeam"

export const useTeam = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeam
  })
}
