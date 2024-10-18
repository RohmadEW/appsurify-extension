import type { eventWithTime, mouseInteractionData } from "@rrweb/types"
import { useRef } from "react"
import * as rrweb from "rrweb"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { ProjectRecording } from "~popup/types/recording"
import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

export default function useRecording() {
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)
  const [projectRecording, setProjectRecording] = useStorage<ProjectRecording>(
    StorageKey.PROJECT_RECORDING
  )
  const [rrwebData, setRrwebData] = useStorage<eventWithTime[]>({
    key: StorageKey.RRWEB_DATA,
    instance: new Storage({
      area: "local"
    })
  })

  const rrwebRef = useRef(null)

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
              setRrwebData((data) => [...data, ...snapshots])
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
    rrwebData,
    projectRecording,
    setProjectRecording,
    recording
  }
}
