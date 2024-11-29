import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"

import {
  apiClient,
  removeClientToken,
  setClientToken
} from "~popup/api/api-client"
import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { login, logout } from "~popup/store/authSlice"
import { AUTH_COOKIES, type JWT } from "~popup/types/auth"
import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

export const useInit = () => {
  const { setItem, getItem } = useStorage()
  const [prepare, setPrepare] = useState(true)

  const { isAuthenticated, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const [cookie] = useCookies([AUTH_COOKIES])
  const { routerPage, setRouterPage } = useRouter()

  const [overrideRouterPage, setOverrideRouterPage] = useState<ROUTE_PAGE>()

  useEffect(() => {
    const handleOverrideRouterPage = async () => {
      const override = await getItem(StorageKey.OVERRIDE_ROUTER_PAGE)

      if (override) {
        setRouterPage(override)
        setOverrideRouterPage(override)
      }
    }

    handleOverrideRouterPage()
  }, [])

  useEffect(() => {
    console.log("useInit routerPage:", ` ${routerPage}`)
  }, [routerPage])

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (isAuthenticated && token) {
        if (
          routerPage === ROUTE_PAGE.LOGIN ||
          routerPage === ROUTE_PAGE.REGISTER
        ) {
          setRouterPage(overrideRouterPage ?? ROUTE_PAGE.HOME)
        }

        setClientToken(apiClient, token)
        setItem(StorageKey.TOKEN_BEARER, token)
      } else {
        setRouterPage(ROUTE_PAGE.LOGIN)

        removeClientToken(apiClient)
      }

      setPrepare(false)
    }
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
