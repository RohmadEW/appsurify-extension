import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"

import {
  apiClient,
  removeClientToken,
  setClientToken
} from "~popup/api/api-client"
import { useRouter } from "~popup/hooks/useRouter"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { login, logout } from "~popup/store/authSlice"
import { AUTH_COOKIES, type JWT } from "~popup/types/auth"
import { ROUTE_PAGE } from "~popup/types/route"

export const useInit = () => {
  const [prepare, setPrepare] = useState(true)

  const { isAuthenticated, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const [cookie] = useCookies([AUTH_COOKIES])
  const { routerPage, setRouterPage } = useRouter()

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
          setRouterPage(ROUTE_PAGE.HOME)
        }

        setClientToken(apiClient, token)
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
