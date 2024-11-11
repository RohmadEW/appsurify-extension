import type { eventWithTime, mouseInteractionData } from "@rrweb/types"
import { useRef, useState } from "react"
import * as rrweb from "rrweb"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"
import { RecordingStatus } from "~types/storage"

export default function useRecording() {
  const { setRouterPage } = useRouter()

  const [rrwebData, setRrwebData] = useState<eventWithTime[]>([])
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>(
    RecordingStatus.RECORDING
  )

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
    recordingStatus,
    setRecordingStatus,
    recording
  }
}
