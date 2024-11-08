import { Logout } from "~popup/components/logout"
import ProjectMain from "~popup/components/project/Main"
import TeamMain from "~popup/components/team/Main"
import { useRouter } from "~popup/hooks/useRouter"
import { useAppSelector } from "~popup/hooks/useStore"
import { ROUTE_PAGE } from "~popup/types/route"

import icon from "/assets/icon.png"

export default function Home() {
  const { setRouterPage } = useRouter()
  const { team } = useAppSelector((state) => state.team)

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
        onClick={() => setRouterPage(ROUTE_PAGE.CREATE_NEW_RECORDING)}>
        Start new recording
      </button>
      <TeamMain />
      {team && <ProjectMain />}
      <Logout />
    </div>
  )
}
