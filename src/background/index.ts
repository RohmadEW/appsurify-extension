import type { eventWithTime } from "@rrweb/types"

import { API_URL } from "~libs/constants"
import { uuidv4 } from "~libs/unique"
import type { PostRecordArgs } from "~popup/api/record/postRecord"
import { LocalStorage } from "~popup/hooks/useStorage"
import type { Team } from "~popup/types/team"
import { MessageChromeAction } from "~types/message-chrome"
import { StorageKey } from "~types/storage"

export {}

console.log("Background script surify is running")

const getTokenFromStorage = async () => {
  const token = await LocalStorage.getItem(StorageKey.TOKEN_BEARER)
  return token
}

const getTeamFromStorage = async () => {
  const team = await LocalStorage.getItem(StorageKey.TEAM)
  const teamParsed = JSON.parse(team) as Team | null | undefined
  return teamParsed
}

const getProjectFromStorage = async () => {
  const project = await LocalStorage.getItem(StorageKey.PROJECT)
  const projectParsed = JSON.parse(project)
  return projectParsed
}

const getTestsuiteFromStorage = async () => {
  const testsuite = await LocalStorage.getItem(StorageKey.TESTSUITE)
  const testsuiteParsed = JSON.parse(testsuite)
  return testsuiteParsed
}

const getTestcaseFromStorage = async () => {
  const testcase = await LocalStorage.getItem(StorageKey.TESTCASE)
  return testcase
}

const getTestrunFromStorage = async () => {
  const testrun = await LocalStorage.getItem(StorageKey.TESTRUN)
  return testrun
}

const getRrwebDataFromStorage = async () => {
  const rrwebData = await LocalStorage.getItem(StorageKey.RRWEB_DATA)
  const rrwebDataParsed = JSON.parse(rrwebData) as
    | eventWithTime[]
    | null
    | undefined
  return rrwebDataParsed || []
}

const resetRrwebEvents = async () => {
  await LocalStorage.setItem(StorageKey.RRWEB_DATA, JSON.stringify([]))
}

const handleSaveRecording = async () => {
  chrome.runtime.sendMessage({
    action: MessageChromeAction.STORING_RRWEB_DATA,
    value: true
  })

  try {
    const token = await getTokenFromStorage()
    const team = await getTeamFromStorage()
    const project = await getProjectFromStorage()
    const testsuite = await getTestsuiteFromStorage()
    const testcase = await getTestcaseFromStorage()
    const testrun = await getTestrunFromStorage()
    const rrwebData = await getRrwebDataFromStorage()

    const result = await fetch(
      `${API_URL}/a/${team?.slug}/testmap/api/record/events`,
      {
        method: "POST",
        body: JSON.stringify({
          team_slug: team?.slug,
          project_name: project?.name,
          testsuite_name: testsuite?.name,
          testcase_name: testcase,
          testrun_name: testrun,
          session_key: uuidv4().replace(/-/g, ""),
          page_key: uuidv4().replace(/-/g, ""),
          session_events: rrwebData
        } as PostRecordArgs),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await result.json()
    console.log(data)

    if (result.status !== 200) {
      let errorMessage = ""

      if (result.status === 401) {
        errorMessage = "Unauthorized"
      } else {
        errorMessage = Object.keys(data).reduce((acc, key) => {
          const value = data[key]
          return `${acc}${key}: ${value.join(", ")}\n`
        }, "")
      }

      throw new Error(errorMessage)
    }

    await resetRrwebEvents()

    console.log("Recording data stored successfully")

    chrome.runtime.sendMessage({
      action: MessageChromeAction.STORING_RRWEB_DATA,
      value: false,
      success: true,
      message: "Recording data stored successfully"
    })

    return true
  } catch (error) {
    console.log(error.message)

    chrome.runtime.sendMessage({
      action: MessageChromeAction.STORING_RRWEB_DATA,
      value: false,
      success: false,
      message: error.message
    })

    return false
  }
}

chrome.tabs.onRemoved.addListener(async function (tabId, removeInfo) {
  const tabIdStorage = await LocalStorage.getItem(StorageKey.TAB_ID)
  if (Number(tabIdStorage) === Number(tabId)) {
    handleSaveRecording()
  }
})

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.action) {
    case MessageChromeAction.CLEAR_CONSOLE:
      console.clear()

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: MessageChromeAction.CLEAR_CONSOLE
          })
        }
      })
      break

    case MessageChromeAction.STORE_RRWEB_DATA:
      handleSaveRecording()
      break

    case MessageChromeAction.STOP_RECORDING:
      handleSaveRecording()

      await LocalStorage.setItem(
        StorageKey.RECORDING_STATUS,
        MessageChromeAction.STOP_RECORDING
      )
      break

    default:
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          LocalStorage.setItem(StorageKey.TAB_ID, tabs[0].id)

          chrome.tabs.sendMessage(tabs[0].id, {
            action: message.action
          })
          // Send to popup for notification
          chrome.runtime.sendMessage({
            action: MessageChromeAction.HAS_ACTIVE_TAB,
            recordingStatus: message.action
          })
        } else {
          chrome.runtime.sendMessage({
            action: MessageChromeAction.NO_ACTIVE_TAB,
            recordingStatus: message.action
          })
        }
      })
      break
  }

  return true
})
