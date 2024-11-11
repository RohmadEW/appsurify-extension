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

  const [rrwebData, setRrwebData] = useState<eventWithTime[]>([])
  const [recordingStatus, setRecordingStatus] = useState<MessageChromeAction>()

  useEffect(() => {
    const fetchRrwebData = async () => {
      const data = await getItem(StorageKey.RRWEB_DATA)
      const parsedData = JSON.parse(data)
      setRrwebData(parsedData ?? [])
    }

    const fetchRecordingStatus = async () => {
      const status = await getItem(StorageKey.RECORDING_STATUS)
      setRecordingStatus(status)
    }

    fetchRrwebData()
    fetchRecordingStatus()
  }, [])

  useEffect(() => {
    const saveRecordingStatus = async () => {
      await setItem(StorageKey.RECORDING_STATUS, recordingStatus)
    }

    saveRecordingStatus()
  }, [recordingStatus])

  useEffect(() => {
    const saveRrwebData = async () => {
      await setItem(StorageKey.RRWEB_DATA, JSON.stringify(rrwebData))
    }

    saveRrwebData()
  }, [rrwebData])

  const handleRecording = (action: MessageChromeAction) => {
    setRecordingStatus(action)

    // Send message to content script to start or stop recording
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action
      })
    })

    if (action === MessageChromeAction.START_RECORDING) {
      window.close()
    }
  }

  const handleDownloadRrwebData = () => {
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

  const clearRecording = () => {
    setRrwebData([])
  }

  const clearConsole = () => {
    chrome.runtime.sendMessage({ action: MessageChromeAction.CLEAR_CONSOLE })
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
          className={`plasmo-mt-3 plasmo-text-2xl plasmo-font-bold plasmo-px-2 plasmo-py-1 plasmo-rounded-md ${recordingStatus === MessageChromeAction.START_RECORDING ? "plasmo-bg-green-100 plasmo-border plasmo-border-green-300 plasmo-text-green-600" : "plasmo-bg-blue-100 plasmo-border plasmo-border-blue-300 plasmo-text-blue-600"}`}>
          {recordingStatus?.toUpperCase()}
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
      {recordingStatus === MessageChromeAction.STOP_RECORDING && (
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
        onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
        Back
      </button>
    </div>
  )
}
