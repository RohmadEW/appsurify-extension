import { useEffect } from "react"

import { Logout } from "~popup/components/logout"
import { useCustomCookies } from "~popup/hooks/useCustomCookies"
import { useRouter } from "~popup/hooks/useRouter"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { resetProject } from "~popup/store/projectSlice"
import { resetRecording } from "~popup/store/recordingSlice"
import { resetTeam } from "~popup/store/teamSlice"
import { resetTestcase } from "~popup/store/testcaseSlice"
import { resetTestsuite } from "~popup/store/testsuiteSlice"
import { ROUTE_PAGE } from "~popup/types/route"

import icon from "/assets/icon.png"

export default function Home() {
  const { setTeamId } = useCustomCookies()
  const { setRouterPage } = useRouter()
  const { team } = useAppSelector((state) => state.team)
  const dispatch = useAppDispatch()
  const { removeTeamId, removeProjectId, removeTestsuiteId, removeTestcaseId } =
    useCustomCookies()

  useEffect(() => {
    if (team) {
      setTeamId(team.id)
    }
  }, [])

  const handleNewRecording = () => {
    dispatch(resetTeam())
    dispatch(resetProject())
    dispatch(resetTestsuite())
    dispatch(resetTestcase())
    dispatch(resetRecording())

    removeTeamId()
    removeProjectId()
    removeTestsuiteId()
    removeTestcaseId()

    setRouterPage(ROUTE_PAGE.CREATE_NEW_RECORDING)
  }

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Welcome to Appsurify!
      </div>
      <button
        className="plasmo-btn plasmo-btn-success plasmo-btn-outline plasmo-w-full plasmo-mt-6"
        onClick={handleNewRecording}>
        Start new recording
      </button>
      <Logout />
    </div>
  )
}
