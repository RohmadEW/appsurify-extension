import { Storage } from "@plasmohq/storage"

import { StorageKey } from "~types/storage"

console.log("Background script surify is running")

async function popupStorage() {
  const storage = new Storage()

  storage.watch({
    [StorageKey.ROUTE_PAGE]: (c) => {
      console.log(StorageKey.ROUTE_PAGE, c)
    },
    [StorageKey.IS_LOGIN]: (c) => {
      console.log(StorageKey.IS_LOGIN, c)
    }
  })
}

const main = async () => {
  await popupStorage()
}

main()
