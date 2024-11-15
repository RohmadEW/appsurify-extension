import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import useRecording from "~popup/hooks/useRecording"
import { MessageChromeAction } from "~types/message-chrome"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

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

    // When tab or popup is closed or refreshed or reload, send a message to background to store the data
    window.addEventListener("beforeunload", () => {
      chrome.runtime.sendMessage({
        action: MessageChromeAction.STORE_RRWEB_DATA
      })
    })
  }, [])

  return null
}
