import { Storage } from "@plasmohq/storage"

import { StorageKey } from "~types/storage"

console.log("Background script surify is running")

async function popupStorage() {
  const storage = new Storage()
  await storage.clear()

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
    }
  })
}

const main = async () => {
  await popupStorage()
}

main()
