import { useStorage } from "@plasmohq/storage/hook"

import type { RrwebData } from "~popup/types/recording"
import { ROUTE_PAGE } from "~popup/types/route"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

import icon from "/assets/icon.png"

export default function Recording() {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)
  const [rrwebData] = useStorage<RrwebData>(StorageKey.RRWEB_DATA)

  const handleRecording = () => {
    chrome.runtime.sendMessage(
      {
        action: MessageChromeAction.START_RECORDING
      },
      (response) => {
        console.log(response)
      }
    )
  }

  return (
    <div className="plasmo-pt-6 plasmo-pb-4 plasmo-px-12">
      <img
        src={icon}
        className="plasmo-w-[80px] plasmo-h-[80px] plasmo-mx-auto"
      />
      <div className="plasmo-text-3xl plasmo-mt-4 plasmo-text-center">
        Recording...
      </div>
      <div className="plasmo-mockup-code plasmo-w-full plasmo-h-[280px] plasmo-overflow-x-auto plasmo-overflow-y-auto plasmo-mt-8">
        <pre className="plasmo-mx-4">{JSON.stringify(rrwebData, null, 2)}</pre>
      </div>
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-4"
        onClick={handleRecording}>
        Start Recording
      </button>
      <button
        className="plasmo-btn plasmo-btn-outline plasmo-w-full plasmo-mt-4"
        onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
        Back
      </button>
    </div>
  )
}
