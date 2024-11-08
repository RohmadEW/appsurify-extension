import { useStorage } from "@plasmohq/storage/hook"

import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

export const useRouter = () => {
  const [routerPage, setRouterPage] = useStorage<ROUTE_PAGE>(
    StorageKey.ROUTE_PAGE,
    (value) => (typeof value === "undefined" ? ROUTE_PAGE.LOGIN : value)
  )

  return { routerPage, setRouterPage }
}
