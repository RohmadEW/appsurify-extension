import type { Project } from "~popup/types/project"

export interface ProjectRecording {
  project: Project
  testsuite: string
  testrun: string
}

export interface RrwebData {
  events: Array<{
    type: string
    data: any
    timestamp: number
  }>
  url: string
  viewport: {
    width: number
    height: number
  }
}
