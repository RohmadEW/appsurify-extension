import type { eventWithTime } from "@rrweb/types"

import { useStorage } from "@plasmohq/storage/hook"

import { ROUTE_PAGE } from "~popup/types/route"
import { RecordingStatus, StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function Recording() {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)
  const [rrwebData] = useStorage<eventWithTime[]>(StorageKey.RRWEB_DATA)
  const [recordingStatus, setRecordingStatus] = useStorage<RecordingStatus>(
    StorageKey.RECORDING_STATUS
  )

  const handleRecording = (status: RecordingStatus) => {
    setRecordingStatus(status)
    window.close()
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
          className={`plasmo-mt-3 plasmo-text-2xl plasmo-font-bold plasmo-px-2 plasmo-py-1 plasmo-rounded-md ${recordingStatus === RecordingStatus.RECORDING ? "plasmo-bg-green-100 plasmo-border plasmo-border-green-300 plasmo-text-green-600" : "plasmo-bg-blue-100 plasmo-border plasmo-border-blue-300 plasmo-text-blue-600"}`}>
          {recordingStatus?.toUpperCase()}
        </div>
      </div>
      <div className="plasmo-mt-4 plasmo-text-gray-500 plasmo-italic plasmo-text-center">
        {rrwebData?.length} events recorded
      </div>
      {recordingStatus === RecordingStatus.STOPPED && (
        <button
          className="plasmo-btn plasmo-btn-outline plasmo-btn-primary plasmo-w-full plasmo-mt-4"
          onClick={() => handleRecording(RecordingStatus.RECORDING)}>
          Start Recording
        </button>
      )}
      {recordingStatus === RecordingStatus.RECORDING && (
        <button
          className="plasmo-btn plasmo-btn-outline plasmo-btn-error plasmo-w-full plasmo-mt-4"
          onClick={() => handleRecording(RecordingStatus.STOPPED)}>
          Stop Recording
        </button>
      )}
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-8"
        onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
        Back
      </button>
    </div>
  )
}
