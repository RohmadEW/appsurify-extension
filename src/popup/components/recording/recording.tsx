import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import { ROUTE_PAGE } from "~popup/types/route"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function Recording() {
  const { setRouterPage } = useRouter()
  const { getItem, removeItem } = useStorage()

  const [thisPageReady, setThisPageReady] = useState<boolean>()

  const [recordingStatus, setRecordingStatus] = useState<MessageChromeAction>()
  const [storingRrwebData, setStoringRrwebData] = useState<boolean>(false)

  const handleChromeMessageListener = (message) => {
    switch (message.action) {
      case MessageChromeAction.NO_ACTIVE_TAB:
        toast(
          "No active tab found. Please open a tab to start recording or reload the current page."
        )
        break

      case MessageChromeAction.HAS_ACTIVE_TAB:
        if (recordingStatus === MessageChromeAction.START_RECORDING) {
          window.close()
        }
        break

      case MessageChromeAction.STORING_RRWEB_DATA:
        setStoringRrwebData(message.value)
        console.log(message)
        if (message.value === false) {
          if (message.success) {
            toast.success(message.message)
          } else {
            toast.error(message.message)
          }
        }
        break

      default:
        break
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.removeListener(handleChromeMessageListener)
    chrome.runtime.onMessage.addListener(handleChromeMessageListener)

    const fetchRecordingStatus = async () => {
      const status = await getItem(StorageKey.RECORDING_STATUS)
      setRecordingStatus(status)
    }

    const checkIsThisPageReady = async () => {
      const token = await getItem(StorageKey.TOKEN_BEARER)
      setThisPageReady(!!token)
    }

    fetchRecordingStatus()
    checkIsThisPageReady()
  }, [])

  useEffect(() => {
    if (thisPageReady === false) {
      setRouterPage(ROUTE_PAGE.CREATE_NEW_RECORDING)
    }
  }, [thisPageReady])

  const handleRecording = async (action: MessageChromeAction) => {
    setRecordingStatus(action)

    chrome.runtime.sendMessage({ action })
  }

  const handleBack = async () => {
    await removeItem(StorageKey.OVERRIDE_ROUTER_PAGE)
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
            ? "Recording..."
            : "Recording Stopped"}
        </div>
      </div>
      {recordingStatus === MessageChromeAction.STOP_RECORDING && (
        <>
          {storingRrwebData && (
            <div className="plasmo-alert plasmo-alert-info plasmo-mt-4 plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-rounded-md">
              <span className="plasmo-loading plasmo-loading-spinner"></span>
              <div className="">Storing recording data...</div>
            </div>
          )}
          <button
            className="plasmo-btn plasmo-btn-outline plasmo-btn-primary plasmo-w-full plasmo-mt-4"
            disabled={storingRrwebData}
            onClick={() =>
              handleRecording(MessageChromeAction.START_RECORDING)
            }>
            Start Recording
          </button>
        </>
      )}
      {recordingStatus === MessageChromeAction.START_RECORDING && (
        <button
          className="plasmo-btn plasmo-btn-outline plasmo-btn-error plasmo-w-full plasmo-mt-4"
          onClick={() => handleRecording(MessageChromeAction.STOP_RECORDING)}>
          Stop Recording
        </button>
      )}
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-8"
        disabled={storingRrwebData}
        onClick={handleBack}>
        Back
      </button>
    </div>
  )
}
