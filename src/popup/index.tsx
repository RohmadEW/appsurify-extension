import { useStorage } from "@plasmohq/storage/hook"

import Home from "~popup/components/home"
import { Login } from "~popup/components/login"
import CreateNewProject from "~popup/components/project/new_project"
import CreateNewRecording from "~popup/components/recording/new_recording"
import Recording from "~popup/components/recording/recording"
import ReplyRecording from "~popup/components/recording/reply"
import { Register } from "~popup/components/register"
import { ROUTE_PAGE } from "~popup/types/route"

import "~style.css"

import { StorageKey } from "~types/storage"

function IndexPopup() {
  const [routerPage, setRouterPage] = useStorage<ROUTE_PAGE>(
    StorageKey.ROUTE_PAGE,
    (value) => (typeof value === "undefined" ? ROUTE_PAGE.LOGIN : value)
  )

  return (
    <div
      className={`plasmo-overflow-y-auto ${routerPage === ROUTE_PAGE.REPLY_RECORDING ? "plasmo-h-[800px] plasmo-w-[600px]" : "plasmo-h-[600px] plasmo-w-[400px]"}`}>
      <div className="plasmo-min-h-[560px]">
        {routerPage === ROUTE_PAGE.LOGIN && <Login />}
        {routerPage === ROUTE_PAGE.REGISTER && <Register />}
        {routerPage === ROUTE_PAGE.CREATE_NEW_PROJECT && <CreateNewProject />}
        {routerPage === ROUTE_PAGE.CREATE_NEW_RECORDING && (
          <CreateNewRecording />
        )}
        {routerPage === ROUTE_PAGE.RECORDING && <Recording />}
        {routerPage === ROUTE_PAGE.REPLY_RECORDING && <ReplyRecording />}
        {routerPage === ROUTE_PAGE.HOME && <Home />}
      </div>
      <div className="plasmo-h-[40px] plasmo-border-t plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-4">
        <div>Terms of Service</div>
        <div>Privacy Policy</div>
      </div>
    </div>
  )
}

export default IndexPopup
