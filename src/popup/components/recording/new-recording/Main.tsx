import { useState } from "react"

import { ProjectRecording } from "~popup/components/recording/new-recording/Project"
import { TeamRecording } from "~popup/components/recording/new-recording/Team"
import { TestcaseRecording } from "~popup/components/recording/new-recording/Testcase"
import { TestsuiteRecording } from "~popup/components/recording/new-recording/Testsuite"
import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import { useAppSelector } from "~popup/hooks/useStore"
import { ROUTE_PAGE } from "~popup/types/route"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function CreateNewRecording() {
  const { setRouterPage } = useRouter()
  const { setItem } = useStorage()

  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)
  const { testsuite } = useAppSelector((state) => state.testsuite)
  const { testcase } = useAppSelector((state) => state.testcase)

  const [testrunName, setTestrunName] = useState<string>("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!testcase || !testsuite || !project || !team || !testrunName) {
      alert("Please fill in all the fields")
      return
    }

    await setItem(StorageKey.TEAM, JSON.stringify(team))
    await setItem(StorageKey.PROJECT, JSON.stringify(project))
    await setItem(StorageKey.TESTSUITE, JSON.stringify(testsuite))
    await setItem(StorageKey.TESTCASE, JSON.stringify(testcase))
    await setItem(StorageKey.TESTRUN, testrunName)
    await setItem(
      StorageKey.RECORDING_STATUS,
      MessageChromeAction.START_RECORDING
    )
    await setItem(StorageKey.RRWEB_DATA, JSON.stringify([]))

    // Send message to content script to start recording
    chrome.runtime.sendMessage({ action: MessageChromeAction.START_RECORDING })

    setRouterPage(ROUTE_PAGE.RECORDING)

    window.close()
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
      <form action="" className="plasmo-mt-10" onSubmit={handleSubmit}>
        <div className="plasmo-space-y-4">
          <TeamRecording />
          <ProjectRecording />
          <TestsuiteRecording />
          <TestcaseRecording />
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            value={testrunName}
            onChange={(e) => setTestrunName(e.target.value)}
            placeholder="Testrun Name"
          />
          <button
            type="submit"
            className="plasmo-btn plasmo-btn-primary plasmo-w-full">
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
