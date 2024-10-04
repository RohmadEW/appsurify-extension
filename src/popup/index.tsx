import { Provider as JotaiProvider, useAtomValue } from "jotai"

import { Login } from "~popup/components/login"
import { routerPageStore } from "~popup/store/route"
import { ROUTE_PAGE } from "~popup/types/route"

import "~style.css"

function IndexPopup() {
  const routerPage = useAtomValue(routerPageStore)

  return (
    <JotaiProvider>
      <div className="plasmo-overflow-y-auto plasmo-h-[600px] plasmo-w-[400px]">
        <div className="plasmo-min-h-[560px]">
          {routerPage === ROUTE_PAGE.LOGIN && <Login />}
        </div>
        <div className="plasmo-h-[40px] plasmo-border-t plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-4">
          <div>Terms of Service</div>
          <div>Privacy Policy</div>
        </div>
      </div>
    </JotaiProvider>
  )
}

export default IndexPopup
