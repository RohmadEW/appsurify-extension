import { useStorage } from "@plasmohq/storage/hook"

import { Logout } from "~popup/components/logout"
import { useAppSelector } from "~popup/hooks/useStore"
import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function Home() {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Welcome to {user?.email}!
      </div>
      <div className="plasmo-mt-6 plasmo-space-y-2">
        <button
          className="plasmo-btn plasmo-btn-primary plasmo-btn-outline plasmo-w-full"
          onClick={() => setRouterPage(ROUTE_PAGE.CREATE_NEW_PROJECT)}>
          Start new project
        </button>
        <button
          className="plasmo-btn plasmo-btn-success plasmo-btn-outline plasmo-w-full"
          onClick={() => setRouterPage(ROUTE_PAGE.CREATE_NEW_RECORDING)}>
          Start new recording
        </button>
      </div>
      <Logout />
    </div>
  )
}
