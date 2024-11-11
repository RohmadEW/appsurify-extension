import type { eventWithTime, mouseInteractionData } from "@rrweb/types"
import { useEffect, useRef, useState } from "react"
import * as rrweb from "rrweb"

import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import { ROUTE_PAGE } from "~popup/types/route"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

export default function useRecording() {
  const { getItem, setItem } = useStorage()

  const { setRouterPage } = useRouter()

  const [rrwebData, setRrwebData] = useState<eventWithTime[]>([])
  const [recordingStatus, setRecordingStatus] = useState<MessageChromeAction>()

  const saveRecordingStatus = async (status: MessageChromeAction) => {
    await setItem(StorageKey.RECORDING_STATUS, status)
  }

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

  useEffect(() => {
    const fetchRecordingStatus = async () => {
      const status = await getItem(StorageKey.RECORDING_STATUS)
      setRecordingStatus(status)
    }

    fetchRecordingStatus()
  }, [])

  useEffect(() => {
    saveRecordingStatus(recordingStatus)
  }, [recordingStatus])

  return {
    rrwebData,
    recordingStatus,
    setRecordingStatus,
    recording
  }
}
