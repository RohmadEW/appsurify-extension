import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import useRecording from "~hook/useRecording"
import { RecordingStatus, StorageKey } from "~types/storage"

export default function Recording() {
  const [recordingStatus] = useStorage<RecordingStatus>(
    StorageKey.RECORDING_STATUS
  )

  const { recording } = useRecording()

  useEffect(() => {
    recording(recordingStatus === RecordingStatus.RECORDING)
  }, [recordingStatus])

  return null
}
