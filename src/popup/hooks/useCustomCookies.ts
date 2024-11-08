import { useCookies } from "react-cookie"

import { PROJECT_ID_COOKIE } from "~popup/types/project"
import { TEAM_ID_COOKIE } from "~popup/types/team"
import { TESTCASE_ID_COOKIE } from "~popup/types/testcase"
import { TESTSUITE_ID_COOKIE } from "~popup/types/testsuite"

export const useCustomCookies = () => {
  const [cookieTeamId, setCookieTeamId] = useCookies([TEAM_ID_COOKIE])
  const [cookieProjectId, setCookieProjectId] = useCookies([PROJECT_ID_COOKIE])
  const [cookieTestsuiteId, setCookieTestsuiteId] = useCookies([
    TESTSUITE_ID_COOKIE
  ])
  const [cookieTestcaseId, setCookieTestcaseId] = useCookies([
    TESTCASE_ID_COOKIE
  ])

  const setTeamId = (id: number) => {
    setCookieTeamId(TEAM_ID_COOKIE, id)
  }

  const setProjectId = (id: number) => {
    setCookieProjectId(PROJECT_ID_COOKIE, id)
  }

  const setTestsuiteId = (id: number) => {
    setCookieTestsuiteId(TESTSUITE_ID_COOKIE, id)
  }

  const setTestcaseId = (id: number) => {
    setCookieTestcaseId(TESTCASE_ID_COOKIE, id)
  }

  return {
    teamId: cookieTeamId[TEAM_ID_COOKIE],
    projectId: cookieProjectId[PROJECT_ID_COOKIE],
    testcaseId: cookieTestcaseId[TESTCASE_ID_COOKIE],
    testsuiteId: cookieTestsuiteId[TESTSUITE_ID_COOKIE],
    setTeamId,
    setProjectId,
    setTestsuiteId,
    setTestcaseId
  }
}
