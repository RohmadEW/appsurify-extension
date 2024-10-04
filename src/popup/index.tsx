import { useState } from "react"

import { Login } from "~popup/components/login"
import CreateNewProject from "~popup/components/project/new_project"
import { Register } from "~popup/components/register"
import { ROUTE_PAGE } from "~popup/types/route"

import "~style.css"

function IndexPopup() {
  const [routerPage, setRouterPage] = useState<ROUTE_PAGE>(ROUTE_PAGE.LOGIN)

  return (
    <div className="plasmo-overflow-y-auto plasmo-h-[600px] plasmo-w-[400px]">
      <div className="plasmo-min-h-[560px]">
        {routerPage === ROUTE_PAGE.LOGIN && (
          <Login setRouterPage={setRouterPage} />
        )}
        {routerPage === ROUTE_PAGE.REGISTER && (
          <Register setRouterPage={setRouterPage} />
        )}
        {routerPage === ROUTE_PAGE.CREATE_NEW_PROJECT && (
          <CreateNewProject setRouterPage={setRouterPage} />
        )}
      </div>
      <div className="plasmo-h-[40px] plasmo-border-t plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-4">
        <div>Terms of Service</div>
        <div>Privacy Policy</div>
      </div>
    </div>
  )
}

export default IndexPopup
