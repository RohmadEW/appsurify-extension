import { Provider as JotaiProvider, useAtomValue } from "jotai"

import { Login } from "~popup/components/login"
import { routerPageStore } from "~popup/store/route"
import { ROUTE_PAGE } from "~popup/types/route"

import "~style.css"

function IndexPopup() {
  const routerPage = useAtomValue(routerPageStore)

  return (
    <JotaiProvider>
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-[560px] plasmo-w-[400px]">
        {routerPage === ROUTE_PAGE.LOGIN && <Login />}
      </div>
    </JotaiProvider>
  )
}

export default IndexPopup
