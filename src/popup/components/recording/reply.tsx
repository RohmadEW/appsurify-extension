import type { eventWithTime } from "@rrweb/types"
import rrwebPlayer from "rrweb-player"

import "rrweb-player/dist/style.css"

import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function ReplyRecording() {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)
  const [rrwebData] = useStorage<eventWithTime[]>(
    StorageKey.RRWEB_DATA,
    (value) => value ?? []
  )

  const reply = () => {
    if (rrwebData.length > 0) {
      new rrwebPlayer({
        target: document.getElementById("replay-container"),
        props: {
          events: rrwebData,
          autoPlay: true,
          skipInactive: true,
          width: 500,
          height: 450
        }
      })
    }
  }

  useEffect(() => {
    reply()
  }, [])

  useEffect(() => {
    reply()
  }, [rrwebData])

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
        <img src={icon} className="plasmo-w-[80px] plasmo-h-[80px]" />
        <div>
          <div className="plasmo-text-3xl">Reply Recording</div>
          <div>There are {rrwebData.length} events recorded</div>
        </div>
      </div>
      <div className="plasmo-mt-4 plasmo-border plasmo-border-gray-100 plasmo-shadow-md plasmo-overflow-x-auto">
        <div id="replay-container" style={{ width: "100%", height: "450px" }} />
      </div>
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-8 plasmo-mb-4"
        onClick={() => setRouterPage(ROUTE_PAGE.RECORDING)}>
        Back
      </button>
    </div>
  )
}
