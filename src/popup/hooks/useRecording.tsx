import type { mouseInteractionData } from "@rrweb/types"
import { useRef } from "react"
import * as rrweb from "rrweb"

import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import { ROUTE_PAGE } from "~popup/types/route"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

export default function useRecording() {
  const { getItem, setItem } = useStorage()

  const { setRouterPage } = useRouter()

  const rrwebRef = useRef(null)

  const saveRrwebData = async (snapshots) => {
    const data = await getItem(StorageKey.RRWEB_DATA)
    const parsedData = JSON.parse(data)
    let dataSaved = snapshots
    if (Array.isArray(parsedData)) {
      dataSaved = [...parsedData, ...snapshots]
      await setItem(StorageKey.RRWEB_DATA, JSON.stringify(dataSaved))
    } else {
      await setItem(StorageKey.RRWEB_DATA, JSON.stringify(dataSaved))
    }

    // Send to background
    chrome.runtime.sendMessage({
      action: MessageChromeAction.RRWEB_SAVED,
      data: dataSaved
    })
  }

  const recording = (run: boolean) => {
    let snapshots = []
    let timeoutSnapshot: NodeJS.Timeout | null = null

    if (run) {
      setRouterPage(ROUTE_PAGE.RECORDING)

      rrwebRef.current = rrweb.record({
        emit(event) {
          if (
            event.type === rrweb.EventType.IncrementalSnapshot &&
            !(
              (event.data.source === rrweb.IncrementalSource.MouseInteraction &&
                [rrweb.MouseInteractions.Click].includes(
                  (event.data as mouseInteractionData).type
                )) ||
              event.data.source === rrweb.IncrementalSource.Input
            )
          )
            return

          snapshots.push(event)

          if (timeoutSnapshot === null) {
            timeoutSnapshot = setTimeout(() => {
              saveRrwebData(snapshots)
              snapshots = []
              timeoutSnapshot = null
            }, 1000)
          }
        },
        sampling: {
          mousemove: true,
          mouseInteraction: true,
          scroll: 150,
          media: 300
        }
      })
    } else {
      rrwebRef.current?.()
    }
  }

  return {
    recording
  }
}
