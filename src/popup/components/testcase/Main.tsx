import { useEffect } from "react"

import { useProjectById } from "~popup/hooks/project/useProjectById"
import { useTeamById } from "~popup/hooks/team/useTeamById"
import { useCustomCookies } from "~popup/hooks/useCustomCookies"
import { changeProject } from "~popup/store/projectSlice"
import { changeTeam } from "~popup/store/teamSlice"
import { changeTestsuite } from "~popup/store/testsuiteSlice"

import { useTestsuiteById } from "../../hooks/testsuite/useTestsuiteById"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import ListTestCase from "./List"
import { LoadingTestCase } from "./Loading"

export default function TestCaseMain() {
  const { project: projectStore } = useAppSelector((state) => state.project)
  const { team: teamStore } = useAppSelector((state) => state.team)
  const { testsuite: testsuiteStore } = useAppSelector(
    (state) => state.testsuite
  )

  const dispatch = useAppDispatch()
  const { teamId, projectId, testsuiteId } = useCustomCookies()

  const { data: team } = useTeamById({
    id: teamId
  })

  const { data: project } = useProjectById({
    id: projectId
  })

  const { data: testsuite } = useTestsuiteById({
    id: testsuiteId
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

  useEffect(() => {
    if (testsuite) {
      dispatch(changeTestsuite(testsuite))
    }
  }, [testsuite])

  if (testsuiteStore && projectStore && teamStore) {
    return <ListTestCase />
  }

  return <LoadingTestCase />
}
