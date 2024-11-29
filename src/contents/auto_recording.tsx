import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import useRecording from "~popup/hooks/useRecording"
import { useStorage } from "~popup/hooks/useStorage"
import type { Project } from "~popup/types/project"
import type { Team } from "~popup/types/team"
import type { Testsuite } from "~popup/types/testsuite"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

export const config: PlasmoCSConfig = {
  matches: ["https://appsurify.com/testmap/*"]
}

/**
 * URL example: https://appsurify.com/testmap/?team=appsurify&project=PROJECT%20TESTING&testsuite=TEST%20SUITE%201&testcase=TC&testrun=TR%31&api=1234&user=1
 *
 * @returns
 */
export default function Recording() {
  const { setItem } = useStorage()

  const { recording } = useRecording()

  const queryParams = new URLSearchParams(window.location.search)
  const team = queryParams.get("team")
  const project = queryParams.get("project")
  const testsuite = queryParams.get("testsuite")
  const testcase = queryParams.get("testcase")
  const testrun = queryParams.get("testrun")
  const api = queryParams.get("api")
  const user = queryParams.get("user")

  const handleDefineLocalStorage = async () => {
    await setItem(
      StorageKey.TEAM,
      JSON.stringify({ id: -1, slug: team, name: team } as Team)
    )
    await setItem(
      StorageKey.PROJECT,
      JSON.stringify({ id: -1, name: project } as Project)
    )
    await setItem(
      StorageKey.TESTSUITE,
      JSON.stringify({ id: -1, name: testsuite } as Testsuite)
    )
    await setItem(StorageKey.TESTCASE, testcase)
    await setItem(StorageKey.TESTRUN, testrun)
    await setItem(
      StorageKey.RECORDING_STATUS,
      MessageChromeAction.START_RECORDING
    )
    await setItem(StorageKey.RRWEB_DATA, JSON.stringify([]))
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === MessageChromeAction.CLEAR_CONSOLE) {
        console.clear()
      }
    })

    handleDefineLocalStorage()
  }, [])

  window.addEventListener("load", async () => {
    await handleDefineLocalStorage()
    chrome.runtime.sendMessage({ action: MessageChromeAction.START_RECORDING })
  })

  return null
}
