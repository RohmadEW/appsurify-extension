import { useEffect } from "react"

import { useProjectById } from "../../hooks/project/useProjectById"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import { changeProject } from "../../store/projectSlice"
import ListTestSuite from "./List"
import { LoadingTestSuite } from "./Loading"

export default function TestSuiteMain() {
  const { project: projectStore } = useAppSelector((state) => state.project)
  const dispatch = useAppDispatch()

  const { data: project } = useProjectById({
    id: projectStore.id
  })

  useEffect(() => {
    dispatch(
      changeProject({
        id: projectStore.id,
        name: ""
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (project) {
      dispatch(changeProject(project))
    }
  }, [dispatch, project])

  if (project) {
    return <ListTestSuite />
  }

  return <LoadingTestSuite />
}
