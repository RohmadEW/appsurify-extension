import { MessageChromeAction } from "~types/message-chrome"

export {}

console.log("Background script surify is running")

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.action) {
    case MessageChromeAction.CLEAR_CONSOLE:
      console.clear()

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: MessageChromeAction.CLEAR_CONSOLE
          })
        }
      })
      break

    default:
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: message.action
          })
          // Send to popup for notification
          chrome.runtime.sendMessage({
            action: MessageChromeAction.HAS_ACTIVE_TAB
          })
        } else {
          chrome.runtime.sendMessage({
            action: MessageChromeAction.NO_ACTIVE_TAB
          })
        }
      })
      break
  }

  return true
})
