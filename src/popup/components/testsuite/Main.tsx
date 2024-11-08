import { useEffect } from "react"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

import { useProjectById } from "../../hooks/project/useProjectById"
import { useAppSelector } from "../../hooks/useStore"
import ListTestSuite from "./List"
import { LoadingTestSuite } from "./Loading"

export default function TestSuiteMain() {
  const { project: projectStore } = useAppSelector((state) => state.project)
  const { setRouterPage } = useRouter()

  const { data: project } = useProjectById({
    id: projectStore?.id
  })

  useEffect(() => {
    if (!projectStore?.id) {
      setRouterPage(ROUTE_PAGE.HOME)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (project) {
    return <ListTestSuite />
  }

  return <LoadingTestSuite />
}
