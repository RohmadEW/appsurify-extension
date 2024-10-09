import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type { Project } from "~popup/types/project"
import type { ProjectRecording } from "~popup/types/recording"
import { ROUTE_PAGE } from "~popup/types/route"
import { RecordingStatus, StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function CreateNewRecording() {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)
  const [, setProjectRecording] = useStorage<ProjectRecording>(
    StorageKey.PROJECT_RECORDING
  )
  const [projects] = useStorage<Project[]>(
    StorageKey.PROJECTS,
    (value) => value ?? []
  )
  const [, setRecordingStatus] = useStorage<RecordingStatus>(
    StorageKey.RECORDING_STATUS
  )

  const [project, setProject] = useState<Project>()
  const [testsuite, setTestsuite] = useState<string>()
  const [testrun, setTestrun] = useState<string>()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!project || !testsuite || !testrun) {
      return
    }

    setProjectRecording({
      project,
      testsuite,
      testrun
    })

    setRecordingStatus(RecordingStatus.RECORDING)

    setRouterPage(ROUTE_PAGE.RECORDING)

    window.close()
  }

  if (projects.length === 0) {
    return (
      <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
        <img
          src={icon}
          className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
        />
        <div className="plasmo-text-xl plasmo-mt-4 plasmo-text-center">
          There are no projects available. Please create a new project first.
        </div>
        <button
          className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-10"
          onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Start New Recording
      </div>
      <form action="" className="plasmo-mt-6" onSubmit={handleSubmit}>
        <div className="plasmo-space-y-6">
          <select
            className="plasmo-select plasmo-select-bordered plasmo-w-full"
            value={projects.find((it) => it.id === project?.id)?.id}
            onChange={(event) => {
              setProject(projects.find((it) => it.id === event.target.value))
              setTestsuite(undefined)
            }}>
            <option value="">Projects</option>
            {projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {project && (
            <select
              className="plasmo-select plasmo-select-bordered plasmo-w-full"
              value={testsuite}
              onChange={(event) => setTestsuite(event.target.value)}>
              <option value="">Testsuite Name</option>
              {project?.testsuites.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
          {testsuite && (
            <input
              type="text"
              className="plasmo-input plasmo-input-bordered plasmo-w-full"
              placeholder="Testrun Name"
              value={testrun}
              onChange={(event) => setTestrun(event.target.value)}
            />
          )}
          <button
            type="submit"
            className="plasmo-btn plasmo-btn-primary plasmo-w-full"
            disabled={!project || !testsuite || !testrun}>
            Start Recording
          </button>
          <button
            className="plasmo-btn plasmo-btn-ghost plasmo-w-full"
            onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
