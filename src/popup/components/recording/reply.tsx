import type { eventWithTime } from "@rrweb/types"

import "rrweb-player/dist/style.css"

import { useEffect, useRef } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function ReplyRecording() {
  const ref = useRef<HTMLDivElement>(null)
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)
  const [rrwebData] = useStorage<eventWithTime[]>(StorageKey.RRWEB_DATA)

  useEffect(() => {
    if (ref.current !== null) {
      // new rrwebPlayer({
      //   target: ref.current,
      //   props: {
      //     events: []
      //   }
      // })
    }
  }, [])

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Reply Recording
      </div>
      <div ref={ref}></div>
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-8"
        onClick={() => setRouterPage(ROUTE_PAGE.RECORDING)}>
        Back
      </button>
    </div>
  )
}
