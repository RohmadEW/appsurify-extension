import axios, { isAxiosError, type AxiosInstance } from "axios"

import { LocalStorage } from "~popup/hooks/useStorage"
import { StorageKey } from "~types/storage"

import { API_URL } from "../../libs/constants"

interface ApiClientOptions {
  baseURL: string
}

/**
 * Create an Axios instance with baseURL
 *
 * @param {{ baseURL: string }} param0
 * @param {string} param0.baseURL
 * @returns {AxiosInstance}
 */ /**
 *
 *
 * @param {*} error
 */
const ApiClient = (options: ApiClientOptions): AxiosInstance => {
  const instance = axios.create({
    baseURL: options.baseURL
  })

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      // if unauthorized auto logout
      if (403 === error?.response?.status || 401 === error?.response?.status) {
        await LocalStorage.removeItem(StorageKey.TOKEN_BEARER)
        await LocalStorage.removeItem(StorageKey.TEAM)
        await LocalStorage.removeItem(StorageKey.PROJECT)
        await LocalStorage.removeItem(StorageKey.TESTSUITE)
        await LocalStorage.removeItem(StorageKey.TESTCASE)
        await LocalStorage.removeItem(StorageKey.TESTRUN)
        await LocalStorage.removeItem(StorageKey.RRWEB_DATA)
        await LocalStorage.removeItem(StorageKey.RECORDING_STATUS)
        await LocalStorage.removeItem(StorageKey.OVERRIDE_ROUTER_PAGE)

        throw error
      }

      // skip login error logging
      if (
        isAxiosError(error) &&
        error.response?.status === 400 &&
        error.config?.method === "post" &&
        error.config?.url?.includes("login")
      ) {
        throw error
      }

      if (isAxiosError(error) && error.response?.status !== 401) {
        // skip cancelled error logging
        if (error.message === "Query was cancelled by React Query") {
          throw error
        }

        throw error
      }

      console.error(error)

      throw error
    }
  )

  return instance
}

const setClientToken = (instance: AxiosInstance, token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  instance.defaults.headers.common["Content-Type"] = "application/json"
}

const removeClientToken = (instance: AxiosInstance) => {
  delete instance.defaults.headers.common["Authorization"]
}

const apiClient = ApiClient({
  baseURL: API_URL ?? ""
})

export { apiClient, removeClientToken, setClientToken }
