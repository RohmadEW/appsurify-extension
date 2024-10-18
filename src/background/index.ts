import { Storage } from "@plasmohq/storage"

import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

console.log("Background script surify is running")

const storage = new Storage()
// storage.clear()

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
    },
    [StorageKey.RECORDING_STATUS]: (c) => {
      console.log(StorageKey.RECORDING_STATUS, c)
    }
  })

  // storage.set(StorageKey.RRWEB_DATA, [])
}

const main = async () => {
  await popupStorage()
}

main()

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
      break
  }

  return true
})
