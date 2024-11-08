import QueryProvider from "~popup/providers/QueryProvider"

import "~style.css"

import MainPopup from "~popup/components/main"
import ReduxProvider from "~popup/providers/ReduxProvider"

function IndexPopup() {
  return (
    <ReduxProvider>
      <QueryProvider>
        <MainPopup />
      </QueryProvider>
    </ReduxProvider>
  )
}

export default IndexPopup
