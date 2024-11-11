import { ProjectRecording } from "~popup/components/recording/new-recording/Project"
import { TeamRecording } from "~popup/components/recording/new-recording/Team"
import { TestsuiteRecording } from "~popup/components/recording/new-recording/Testsuite"
import { useRouter } from "~popup/hooks/useRouter"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { ROUTE_PAGE } from "~popup/types/route"

import icon from "/assets/icon.png"

export default function CreateNewRecording() {
  const { routerPage, setRouterPage } = useRouter()

  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)
  const { testsuite } = useAppSelector((state) => state.testsuite)
  const { testcase } = useAppSelector((state) => state.testcase)

  const dispatch = useAppDispatch()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!project || !testsuite) {
      return
    }

    setRouterPage(ROUTE_PAGE.RECORDING)

    window.close()
  }

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Start New Recording
      </div>
      <form action="" className="plasmo-mt-10" onSubmit={handleSubmit}>
        <div className="plasmo-space-y-4">
          <TeamRecording />
          <ProjectRecording />
          <TestsuiteRecording />
          <button
            type="submit"
            className="plasmo-btn plasmo-btn-primary plasmo-w-full"
            disabled={!project || !testsuite}>
            Start Recording
          </button>
          <button
            className="plasmo-btn plasmo-btn-ghost plasmo-w-full"
            onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
