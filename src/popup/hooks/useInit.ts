import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"

import { useStorage } from "@plasmohq/storage/hook"

import {
  apiClient,
  removeClientToken,
  setClientToken
} from "~popup/api/api-client"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { login, logout } from "~popup/store/authSlice"
import { AUTH_COOKIES, type JWT } from "~popup/types/auth"
import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

export const useInit = () => {
  const [prepare, setPrepare] = useState(true)

  const { isAuthenticated, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const [cookie] = useCookies([AUTH_COOKIES])
  const [routerPage, setRouterPage] = useStorage<ROUTE_PAGE>(
    StorageKey.ROUTE_PAGE,
    (value) => (typeof value === "undefined" ? ROUTE_PAGE.LOGIN : value)
  )

  useEffect(() => {
    if (isAuthenticated && token) {
      if (
        routerPage === ROUTE_PAGE.LOGIN ||
        routerPage === ROUTE_PAGE.REGISTER
      ) {
        setRouterPage(ROUTE_PAGE.HOME)
      }

      setClientToken(apiClient, token)
    } else {
      setRouterPage(ROUTE_PAGE.LOGIN)

      removeClientToken(apiClient)
    }

    setPrepare(false)
  }, [isAuthenticated])

  useEffect(() => {
    const jwt: JWT | undefined = cookie[AUTH_COOKIES]

    if (jwt?.access) {
      dispatch(login(jwt))
    } else {
      dispatch(logout())
    }
  }, [cookie])

  return { prepare, routerPage }
}
