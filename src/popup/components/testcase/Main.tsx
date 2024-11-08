import { useEffect } from "react"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

import { useTestsuiteById } from "../../hooks/testsuite/useTestsuiteById"
import { useAppSelector } from "../../hooks/useStore"
import ListTestCase from "./List"
import { LoadingTestCase } from "./Loading"

export default function TestCaseMain() {
  const { testsuite: testsuiteStore } = useAppSelector(
    (state) => state.testsuite
  )
  const { setRouterPage } = useRouter()

  const { data: testsuite } = useTestsuiteById({
    id: testsuiteStore?.id
  })

  useEffect(() => {
    if (!testsuiteStore) {
      setRouterPage(ROUTE_PAGE.TESTSUITE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (testsuite) {
    return <ListTestCase />
  }

  return <LoadingTestCase />
}
