import type { eventWithTime } from "@rrweb/types"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { uuidv4 } from "~libs/unique"
import { useSaveRecord } from "~popup/hooks/record/useSaveRecord"
import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import type { Project } from "~popup/types/project"
import { ROUTE_PAGE } from "~popup/types/route"
import type { Team } from "~popup/types/team"
import type { Testcase } from "~popup/types/testcase"
import type { Testsuite } from "~popup/types/testsuite"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function Recording() {
  const { setRouterPage } = useRouter()
  const { getItem, setItem } = useStorage()

  const [recordingStatus, setRecordingStatus] = useState<MessageChromeAction>()
  const [rrwebData, setRrwebData] = useState<eventWithTime[]>([])

  const { mutate: saveRecord, isPending: saving } = useSaveRecord()

  const [team, setTeam] = useState<Team>()
  const [project, setProject] = useState<Project>()
  const [testsuite, setTestsuite] = useState<Testsuite>()
  const [testcase, setTestcase] = useState<Testcase>()
  const [testcaseName, setTestcaseName] = useState<string>()
  const [testrunName, setTestrunName] = useState<string>()

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      switch (message.action) {
        case MessageChromeAction.RRWEB_SAVED:
          fetchRrwebData()
          break

        case MessageChromeAction.NO_ACTIVE_TAB:
          toast("No active tab found")
          break

        case MessageChromeAction.HAS_ACTIVE_TAB:
          if (recordingStatus === MessageChromeAction.START_RECORDING) {
            window.close()
          }
          break

        default:
          break
      }
    })

    const fetchRecordingStatus = async () => {
      const status = await getItem(StorageKey.RECORDING_STATUS)
      setRecordingStatus(status)
    }

    const fetchRrwebData = async () => {
      const data = await getItem(StorageKey.RRWEB_DATA)
      const parsedData = JSON.parse(data)
      if (parsedData) {
        setRrwebData(parsedData ?? [])
      }
    }

    const fetchTeam = async () => {
      const team = await getItem(StorageKey.TEAM)
      const parsedTeam = JSON.parse(team)
      if (parsedTeam) {
        setTeam(parsedTeam)
      }
    }

    const fetchProject = async () => {
      const project = await getItem(StorageKey.PROJECT)
      const parsedProject = JSON.parse(project)
      if (parsedProject) {
        setProject(parsedProject)
      }
    }

    const fetchTestsuite = async () => {
      const testsuite = await getItem(StorageKey.TESTSUITE)
      const parsedTestsuite = JSON.parse(testsuite)
      if (parsedTestsuite) {
        setTestsuite(parsedTestsuite)
      }
    }

    const fetchTestcase = async () => {
      const testcase = await getItem(StorageKey.TESTCASE)
      setTestcaseName(testcase)
    }

    const fetchTestrunName = async () => {
      const testrunName = await getItem(StorageKey.TESTRUN)
      setTestrunName(testrunName)
    }

    fetchRecordingStatus()
    fetchRrwebData()

    fetchTeam()
    fetchProject()
    fetchTestsuite()
    fetchTestcase()
    fetchTestrunName()
  }, [])

  const handleRecording = (action: MessageChromeAction) => {
    setRecordingStatus(action)

    chrome.runtime.sendMessage({ action })
  }

  const handleDownloadRrwebData = async () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(rrwebData)
    )}`
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "rrweb-data.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove
  }

  const clearRecording = async () => {
    await setItem(StorageKey.RRWEB_DATA, JSON.stringify([]))
    setRrwebData([])
  }

  const clearConsole = () => {
    chrome.runtime.sendMessage({ action: MessageChromeAction.CLEAR_CONSOLE })
  }

  const handleBack = () => {
    setRouterPage(ROUTE_PAGE.CREATE_NEW_RECORDING)
  }

  const handleSaeRecording = async () => {
    saveRecord(
      {
        team_slug: team?.slug,
        project_name: project?.name,
        testsuite_name: testsuite?.name,
        testcase_name: testcaseName,
        testrun_name: testrunName,
        rrwebSessionKey: uuidv4().replaceAll("-", ""),
        rrwebPageKey: uuidv4().replaceAll("-", ""),
        rrwebEvents: rrwebData
      },
      {
        onSuccess: async () => {
          await clearRecording()
          handleBack()
        }
      }
    )
  }

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Recording Status
      </div>
      <div className="plasmo-flex plasmo-justify-center">
        <div
          className={`plasmo-mt-3 plasmo-text-2xl plasmo-font-bold plasmo-px-2 plasmo-py-1 plasmo-rounded-md ${recordingStatus === MessageChromeAction.START_RECORDING ? "plasmo-bg-green-100 plasmo-border plasmo-border-green-300 plasmo-text-green-600" : "plasmo-bg-blue-100 plasmo-border plasmo-border-blue-300 plasmo-text-blue-600"} plasmo-uppercase`}>
          {recordingStatus === MessageChromeAction.START_RECORDING
            ? "Recording"
            : "Not Recording"}
        </div>
      </div>
      {recordingStatus === MessageChromeAction.STOP_RECORDING && (
        <>
          <div className="plasmo-mt-4 plasmo-text-gray-500 plasmo-italic plasmo-text-center">
            {rrwebData?.length} events recorded
          </div>
          <button
            className="plasmo-btn plasmo-btn-primary plasmo-w-full plasmo-mt-4"
            onClick={handleSaeRecording}
            disabled={saving}>
            {saving ? (
              <div className="plasmo-loading plasmo-loading-spinner"></div>
            ) : (
              <div>Save Recording</div>
            )}
          </button>
          <button
            className="plasmo-btn plasmo-btn-outline plasmo-btn-primary plasmo-w-full plasmo-mt-4"
            onClick={() =>
              handleRecording(MessageChromeAction.START_RECORDING)
            }>
            Start Recording
          </button>
          <button
            className="plasmo-btn plasmo-btn-outline plasmo-btn-primary plasmo-w-full plasmo-mt-4"
            onClick={clearRecording}>
            Clear Recording
          </button>
          <button
            className="plasmo-btn plasmo-btn-outline plasmo-btn-primary plasmo-w-full plasmo-mt-4"
            onClick={handleDownloadRrwebData}>
            Download Recording
          </button>
        </>
      )}
      {recordingStatus === MessageChromeAction.START_RECORDING && (
        <>
          <div className="plasmo-mt-4 plasmo-text-gray-500 plasmo-italic plasmo-text-left">
            {rrwebData?.length} events recorded. This is the last data:
          </div>
          <div className="plasmo-mockup-code plasmo-mt-2 ">
            <pre>
              {JSON.stringify(rrwebData[rrwebData.length - 1], null, 2)}
            </pre>
          </div>
          <button
            className="plasmo-btn plasmo-btn-outline plasmo-btn-error plasmo-w-full plasmo-mt-4"
            onClick={() => handleRecording(MessageChromeAction.STOP_RECORDING)}>
            Stop Recording
          </button>
        </>
      )}
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-btn-error plasmo-w-full plasmo-mt-4"
        onClick={clearConsole}>
        Clear Console
      </button>
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-8"
        onClick={handleBack}>
        Back
      </button>
    </div>
  )
}
