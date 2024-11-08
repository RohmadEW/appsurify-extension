import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { uuidv4 } from "~libs/unique"
import useRecording from "~popup/hooks/useRecording"
import type { Project } from "~popup/types/project"
import { MessageChromeAction } from "~types/message-chrome"
import { RecordingStatus, StorageKey } from "~types/storage"

export const config: PlasmoCSConfig = {
  matches: ["https://appsurify.com/testmap/*"]
}

export default function Recording() {
  const [recordingStatus, setRecordingStatus] = useStorage<RecordingStatus>(
    StorageKey.RECORDING_STATUS
  )
  const { recording, projectRecording, setProjectRecording } = useRecording()

  const [projects, setProjects] = useStorage<Project[]>(
    StorageKey.PROJECTS,
    (value) => value ?? []
  )

  const queryParams = new URLSearchParams(window.location.search)
  const project = queryParams.get("project")
  const testsuite = queryParams.get("testsuite")
  const testrun = queryParams.get("testrun")
  const api = queryParams.get("api")
  const user = queryParams.get("user")

  const upsertProject = () => {
    setProjects((projects) => {
      const projectIndex = projects.findIndex((p) => p.name === project)

      if (projectIndex === -1) {
        return [
          ...projects,
          {
            id: uuidv4(),
            name: project,
            testsuites: [testsuite]
          }
        ]
      }

      const projectData = projects[projectIndex]

      if (projectData.testsuites.includes(testsuite)) {
        return projects
      }

      return [
        ...projects.slice(0, projectIndex),
        {
          ...projectData,
          testsuites: [...projectData.testsuites, testsuite]
        },
        ...projects.slice(projectIndex + 1)
      ]
    })
  }

  useEffect(() => {
    recording(recordingStatus === RecordingStatus.RECORDING)
  }, [recordingStatus])

  useEffect(() => {
    upsertProject()

    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === MessageChromeAction.CLEAR_CONSOLE) {
        console.clear()
      }
    })
  }, [])

  useEffect(() => {
    const currentProject = projects.find((p) => p.name === project)
    if (currentProject) {
      setProjectRecording({
        project: currentProject,
        testsuite,
        testrun,
        api,
        user
      })
    }
  }, [projects])

  useEffect(() => {
    if (projectRecording) {
      setRecordingStatus(RecordingStatus.RECORDING)
    }
  }, [projectRecording])

  window.addEventListener("beforeunload", () => {
    setRecordingStatus(RecordingStatus.STOPPED)
  })

  return null
}
