import { Storage } from "@plasmohq/storage"

import rrwebInjection from "~background/rrweb-injection"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

console.log("Background script surify is running")

const storage = new Storage()

async function popupStorage() {
  storage.watch({
    [StorageKey.ROUTE_PAGE]: (c) => {
      console.log(StorageKey.ROUTE_PAGE, c)
    },
    [StorageKey.IS_LOGIN]: (c) => {
      console.log(StorageKey.IS_LOGIN, c)
    },
    [StorageKey.PROJECTS]: (c) => {
      console.log(StorageKey.PROJECTS, c)
    },
    [StorageKey.PROJECT_RECORDING]: (c) => {
      console.log(StorageKey.PROJECT_RECORDING, c)
    },
    [StorageKey.RRWEB_DATA]: (c) => {
      console.log(new Date(), StorageKey.RRWEB_DATA, c)
    }
  })
}

const main = async () => {
  await popupStorage()
}

main()

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case MessageChromeAction.START_RECORDING:
      console.log("Start recording: background script")
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id !== undefined) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: rrwebInjection
          })
        } else {
          console.error("No active tab found")
        }
      })

    case MessageChromeAction.RECORDING_EVENT:
      storage.set(StorageKey.RRWEB_DATA, message.payload)
      break

    case MessageChromeAction.CLOSE_POPUP:
      chrome.action.setPopup({ popup: "" })
      break

    default:
      break
  }

  return true
})
