import type { Project } from "~popup/types/project"
import type { Team } from "~popup/types/team"
import type { Testcase } from "~popup/types/testcase"
import type { Testsuite } from "~popup/types/testsuite"

export interface Recording {
  team: Team
  project: Project
  testsuite: Testsuite
  testcase: Testcase
  testrun: string
  rrwebSessionKey: string
  rrwebPageKey: string
  rrwebEvents: string[]
}
