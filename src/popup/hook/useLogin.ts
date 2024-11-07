import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useCookies } from "react-cookie"
import { toast } from "react-toastify"

import { useStorage } from "@plasmohq/storage/hook"

import type { ErrorResponse } from "~popup/types/response"
import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

import type { PostLoginArgs } from "../api/postLogin"
import { postLogin } from "../api/postLogin"
import { AUTH_COOKIES, type AuthType, type JWT } from "../types/auth"

export const useLogin = () => {
  const [, setCookie] = useCookies([AUTH_COOKIES])
  const [, setRouterPage] = useStorage<ROUTE_PAGE>(StorageKey.ROUTE_PAGE)

  return useMutation<JWT, AxiosError<ErrorResponse>, PostLoginArgs>({
    mutationFn: async (args) => await postLogin(args),
    onSuccess: (jwt: JWT) => {
      toast("Login successful.")

      const auth: AuthType = {
        isAuthenticated: true,
        token: jwt.access,
        refresh: jwt.refresh,
        user: jwt.user,
        isLoading: false
      }

      setCookie(AUTH_COOKIES, auth)
      setRouterPage(ROUTE_PAGE.HOME)
    },
    onError: (error) => {
      toast(
        error.response?.data.detail ||
          error.response?.data.non_field_errors?.join(", ") ||
          "An error occurred."
      )
    }
  })
}
