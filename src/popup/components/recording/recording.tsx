import type { eventWithTime } from "@rrweb/types"
import { useEffect, useState } from "react"

import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import { ROUTE_PAGE } from "~popup/types/route"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function Recording() {
  const { setRouterPage } = useRouter()
  const { getItem, setItem } = useStorage()

  const [recordingStatus, setRecordingStatus] = useState<MessageChromeAction>()
  const [rrwebData, setRrwebData] = useState<eventWithTime[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === MessageChromeAction.RRWEB_SAVED) {
        fetchRrwebData()
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

    fetchRecordingStatus()
    fetchRrwebData()
  }, [])

  const handleRecording = (action: MessageChromeAction) => {
    setRecordingStatus(action)

    chrome.runtime.sendMessage({ action })

    if (action === MessageChromeAction.START_RECORDING) {
      window.close()
    }
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
