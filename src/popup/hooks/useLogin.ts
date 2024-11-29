import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useCookies } from "react-cookie"
import { toast } from "react-toastify"

import { apiClient, setClientToken } from "~popup/api/api-client"
import { useRouter } from "~popup/hooks/useRouter"
import { useStorage } from "~popup/hooks/useStorage"
import { useAppDispatch } from "~popup/hooks/useStore"
import { login } from "~popup/store/authSlice"
import type { ErrorResponse } from "~popup/types/response"
import { ROUTE_PAGE } from "~popup/types/route"
import { StorageKey } from "~types/storage"

import type { PostLoginArgs } from "../api/postLogin"
import { postLogin } from "../api/postLogin"
import { AUTH_COOKIES, type JWT } from "../types/auth"

export const useLogin = () => {
  const [, setCookie] = useCookies([AUTH_COOKIES])
  const { setRouterPage } = useRouter()
  const dispatch = useAppDispatch()
  const { setItem } = useStorage()

  return useMutation<JWT, AxiosError<ErrorResponse>, PostLoginArgs>({
    mutationFn: async (args) => await postLogin(args),
    onSuccess: (jwt: JWT) => {
      toast("Login successful.")

      setCookie(AUTH_COOKIES, jwt)
      setClientToken(apiClient, jwt.access)
      dispatch(login(jwt))
      setRouterPage(ROUTE_PAGE.HOME)
      setItem(StorageKey.TOKEN_BEARER, jwt.access)
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
