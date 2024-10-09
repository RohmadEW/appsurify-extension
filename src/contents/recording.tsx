import type { eventWithTime } from "@rrweb/types"
import { useEffect, useRef } from "react"
import * as rrweb from "rrweb"

import { useStorage } from "@plasmohq/storage/hook"

import { RecordingStatus, StorageKey } from "~types/storage"

export default function Recording() {
  const [recordingStatus] = useStorage<RecordingStatus>(
    StorageKey.RECORDING_STATUS
  )
  const [, setRrwebData] = useStorage<eventWithTime[]>(
    StorageKey.RRWEB_DATA,
    (value) => value ?? []
  )

  const rrwebRef = useRef(null)

  const recording = (run: boolean) => {
    let snapshots = []
    let timeoutSnapshot: NodeJS.Timeout | null = null

    if (run) {
      rrwebRef.current = rrweb.record({
        emit(event) {
          console.log("Event", event)
          snapshots.push(event)

          if (timeoutSnapshot === null) {
            timeoutSnapshot = setTimeout(() => {
              console.log("Saving Snapshots", snapshots)
              setRrwebData((prev) => [...prev, ...snapshots])
              timeoutSnapshot = null
              snapshots = []
            }, 1000)
          }
        }
      })
    } else {
      console.log("Stop Recording")
      rrwebRef.current?.()
    }
  }

  useEffect(() => {
    recording(recordingStatus === RecordingStatus.RECORDING)
  }, [recordingStatus])

  return null
}
