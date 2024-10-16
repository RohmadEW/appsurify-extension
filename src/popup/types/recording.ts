import type { Project } from "~popup/types/project"

export interface ProjectRecording {
  project: Project
  testsuite: string
  testrun: string
  api: string
  user: string
}
