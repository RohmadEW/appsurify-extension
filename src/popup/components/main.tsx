import Home from "~popup/components/home"
import { Login } from "~popup/components/login"
import CreateNewRecording from "~popup/components/recording/new_recording"
import Recording from "~popup/components/recording/recording"
import ReplyRecording from "~popup/components/recording/reply"
import { Register } from "~popup/components/register"
import { ROUTE_PAGE } from "~popup/types/route"

import "react-toastify/dist/ReactToastify.css"
import "~style.css"

import { ToastContainer } from "react-toastify"

import TestSuiteMain from "~popup/components/testsuite/Main"
import { useInit } from "~popup/hooks/useInit"

function MainPopup() {
  const { prepare, routerPage } = useInit()

  if (prepare) {
    return (
      <div className="plasmo-h-[600px] plasmo-w-[400px] plasmo-flex plasmo-items-center plasmo-justify-center">
        <div className="plasmo-loading plasmo-loading-spinner plasmo-loading-lg"></div>
      </div>
    )
  }

  return (
    <div
      className={`plasmo-overflow-y-auto ${routerPage === ROUTE_PAGE.REPLY_RECORDING ? "plasmo-h-[800px] plasmo-w-[600px]" : "plasmo-h-[600px] plasmo-w-[400px]"}`}>
      <ToastContainer />
      <div className="plasmo-min-h-[560px]">
        {routerPage === ROUTE_PAGE.LOGIN && <Login />}
        {routerPage === ROUTE_PAGE.REGISTER && <Register />}
        {routerPage === ROUTE_PAGE.CREATE_NEW_RECORDING && (
          <CreateNewRecording />
        )}
        {routerPage === ROUTE_PAGE.RECORDING && <Recording />}
        {routerPage === ROUTE_PAGE.REPLY_RECORDING && <ReplyRecording />}
        {routerPage === ROUTE_PAGE.HOME && <Home />}
        {routerPage === ROUTE_PAGE.TESTSUITE && <TestSuiteMain />}
      </div>
      <div className="plasmo-h-[40px] plasmo-border-t plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-4">
        <div>Terms of Service</div>
        <div>Privacy Policy</div>
      </div>
    </div>
  )
}

export default MainPopup
