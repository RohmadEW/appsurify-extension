import { useStorage } from "@plasmohq/storage/hook"

import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function CreateNewProject() {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Add New Project
      </div>
      <form action="" className="plasmo-mt-6">
        <div className="plasmo-space-y-6">
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Add Project Name Here *"
          />
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Add New Testsuite Here *"
          />
          <button className="plasmo-btn plasmo-btn-primary plasmo-w-full">
            Create
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
