import { useEffect } from "react"

import useRecording from "~popup/hooks/useRecording"
import { MessageChromeAction } from "~types/message-chrome"

export default function Recording() {
  const { recording } = useRecording()

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === MessageChromeAction.CLEAR_CONSOLE) {
        console.clear()
      } else if (message.action === MessageChromeAction.START_RECORDING) {
        recording(true)
      } else if (message.action === MessageChromeAction.STOP_RECORDING) {
        recording(false)
      }
    })
  }, [])

  return null
}
