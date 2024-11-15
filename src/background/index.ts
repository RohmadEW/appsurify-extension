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

const clearAllDataForSaveRecording = async () => {
  await LocalStorage.removeItem(StorageKey.TOKEN_BEARER)
  await LocalStorage.removeItem(StorageKey.TEAM)
  await LocalStorage.removeItem(StorageKey.PROJECT)
  await LocalStorage.removeItem(StorageKey.TESTSUITE)
  await LocalStorage.removeItem(StorageKey.TESTCASE)
  await LocalStorage.removeItem(StorageKey.TESTRUN)
  await LocalStorage.removeItem(StorageKey.RRWEB_DATA)
}

const handleSaveRecording = async () => {
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
          rrwebSessionKey: uuidv4().replace(/-/g, ""),
          rrwebPageKey: uuidv4().replace(/-/g, ""),
          rrwebEvents: rrwebData
        } as PostRecordArgs),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await result.json()
    console.log(data)
    await clearAllDataForSaveRecording()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

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

    default:
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: message.action
          })
          // Send to popup for notification
          chrome.runtime.sendMessage({
            action: MessageChromeAction.HAS_ACTIVE_TAB
          })
        } else {
          chrome.runtime.sendMessage({
            action: MessageChromeAction.NO_ACTIVE_TAB
          })
        }
      })
      break
  }

  return true
})
