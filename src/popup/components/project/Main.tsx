import { useEffect } from "react"

import { LoadingProject } from "~popup/components/project/Loading"
import { useTeamById } from "~popup/hooks/team/useTeamById"
import { useCustomCookies } from "~popup/hooks/useCustomCookies"
import { changeTeam } from "~popup/store/teamSlice"

import { useAppDispatch } from "../../hooks/useStore"
import ListTestCase from "./List"

export default function TestCaseMain() {
  const { teamId } = useCustomCookies()
  const dispatch = useAppDispatch()

  const { data: team } = useTeamById({
    id: teamId
  })

  useEffect(() => {
    if (team) {
      dispatch(changeTeam(team))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team])

  if (team) {
    return <ListTestCase />
  }

  return <LoadingProject />
}
