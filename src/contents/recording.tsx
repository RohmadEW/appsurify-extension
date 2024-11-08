import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import useRecording from "~popup/hooks/useRecording"
import { MessageChromeAction } from "~types/message-chrome"
import { RecordingStatus, StorageKey } from "~types/storage"

export default function Recording() {
  const [recordingStatus] = useStorage<RecordingStatus>(
    StorageKey.RECORDING_STATUS
  )

  const { recording } = useRecording()

  useEffect(() => {
    recording(recordingStatus === RecordingStatus.RECORDING)
  }, [recordingStatus])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === MessageChromeAction.CLEAR_CONSOLE) {
        console.clear()
      }
    })
  }, [])

  return null
}
