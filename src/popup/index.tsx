import { Login } from "~popup/components/login"
import { Register } from "~popup/components/register"
import { RouteProvider, useRoute } from "~popup/context/route"
import { ROUTE_PAGE } from "~popup/types/route"

import "~style.css"

function IndexPopup() {
  const { currentRoute } = useRoute()

  return (
    <RouteProvider>
      <div className="plasmo-overflow-y-auto plasmo-h-[600px] plasmo-w-[400px]">
        <div className="plasmo-min-h-[560px]">
          {currentRoute === ROUTE_PAGE.LOGIN && <Login />}
          {currentRoute === ROUTE_PAGE.REGISTER && <Register />}
        </div>
        <div className="plasmo-h-[40px] plasmo-border-t plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-4">
          <div>Terms of Service</div>
          <div>Privacy Policy</div>
        </div>
      </div>
    </RouteProvider>
  )
}

export default IndexPopup
