import type { eventWithTime } from "@rrweb/types"
import { useEffect, useState } from "react"
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

  const [rrwebState, setRrwebState] = useState(null)

  const recording = (run: boolean) => {
    let snapshots = []
    let timeoutSnapshot: NodeJS.Timeout | null = null

    if (run) {
      const rrwebRecord = rrweb.record({
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
      // setRrwebState(rrwebRecord)
    } else {
      rrwebState?.()
    }
  }

  useEffect(() => {
    recording(recordingStatus === RecordingStatus.RECORDING)
  }, [recordingStatus])

  return null
}
