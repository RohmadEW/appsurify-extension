import { useEffect } from "react"

import { useTeamById } from "~popup/hooks/team/useTeamById"
import { useCustomCookies } from "~popup/hooks/useCustomCookies"
import { changeProject } from "~popup/store/projectSlice"
import { changeTeam } from "~popup/store/teamSlice"

import { useProjectById } from "../../hooks/project/useProjectById"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import ListTestSuite from "./List"
import { LoadingTestSuite } from "./Loading"

export default function TestSuiteMain() {
  const { project: projectStore } = useAppSelector((state) => state.project)
  const { team: teamStore } = useAppSelector((state) => state.team)

  const dispatch = useAppDispatch()
  const { teamId, projectId } = useCustomCookies()

  const { data: team } = useTeamById({
    id: teamId
  })

  const { data: project } = useProjectById({
    id: projectId
  })

  useEffect(() => {
    if (project) {
      dispatch(changeProject(project))
    }
  }, [project])

  useEffect(() => {
    if (team) {
      dispatch(changeTeam(team))
    }
  }, [team])

  if (projectStore && teamStore) {
    return <ListTestSuite />
  }

  return <LoadingTestSuite />
}
