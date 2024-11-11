import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import useRecording from "~popup/hooks/useRecording"
import { useStorage } from "~popup/hooks/useStorage"
import { MessageChromeAction } from "~types/message-chrome"

export const config: PlasmoCSConfig = {
  matches: ["https://appsurify.com/testmap/*"]
}

export default function Recording() {
  const { getItem, setItem } = useStorage()

  const { recording, setRecordingStatus } = useRecording()

  const queryParams = new URLSearchParams(window.location.search)
  const project = queryParams.get("project")
  const testsuite = queryParams.get("testsuite")
  const testrun = queryParams.get("testrun")
  const api = queryParams.get("api")
  const user = queryParams.get("user")

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === MessageChromeAction.CLEAR_CONSOLE) {
        console.clear()
      } else if (message.action === MessageChromeAction.START_RECORDING) {
        console.log("Start recording")
        recording(true)
      } else if (message.action === MessageChromeAction.STOP_RECORDING) {
        console.log("Stop recording")
        recording(false)
      }
    })
  }, [])

  window.addEventListener("load", () => {
    setRecordingStatus(MessageChromeAction.START_RECORDING)
  })

  window.addEventListener("beforeunload", () => {
    setRecordingStatus(MessageChromeAction.STOP_RECORDING)
  })

  return null
}
