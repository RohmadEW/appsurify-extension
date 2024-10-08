import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { rrwebRecord } from "~libs/rrweb"
import type { RrwebData } from "~popup/types/recording"
import { RecordingStatus, StorageKey } from "~types/storage"

export default function Recording() {
  const [recordingStatus] = useStorage<RecordingStatus>(
    StorageKey.RECORDING_STATUS
  )

  if (recordingStatus === RecordingStatus.RECORDING) {
    return <StartRecording />
  }

  return null
}

const StartRecording = () => {
  const [, setRrwebData] = useStorage<RrwebData[]>(
    StorageKey.RRWEB_DATA,
    (value) => value ?? []
  )

  const recording = () => {
    let snapshots: RrwebData[] = []
    let timeout: NodeJS.Timeout | null = null

    rrwebRecord({
      emit: async (event) => {
        console.log("Event: ", event)
        snapshots.push(event)

        if (timeout === null) {
          timeout = setTimeout(() => {
            console.log("Sending to background: ", snapshots)
            setRrwebData((prev) => [...prev, ...snapshots])

            snapshots = []
            timeout = null
          }, 1000)
        }
      }
    })
  }

  useEffect(() => {
    recording()
  }, [])

  return null
}
