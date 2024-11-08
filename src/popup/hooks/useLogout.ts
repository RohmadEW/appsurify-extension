import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useCookies } from "react-cookie"
import { toast } from "react-toastify"

import { useRouter } from "~popup/hooks/useRouter"
import { useAppDispatch } from "~popup/hooks/useStore"
import { logout } from "~popup/store/authSlice"
import type { ErrorResponse } from "~popup/types/response"
import { ROUTE_PAGE } from "~popup/types/route"

import { apiClient, removeClientToken } from "../api/api-client"
import { postLogout } from "../api/postLogout"
import { AUTH_COOKIES } from "../types/auth"

export const useLogout = () => {
  const [, , removeCookie] = useCookies([AUTH_COOKIES])
  const { setRouterPage } = useRouter()
  const dispatch = useAppDispatch()

  const destroySession = () => {
    toast("Logout successful.")
    removeCookie(AUTH_COOKIES)
    removeClientToken(apiClient)
    setRouterPage(ROUTE_PAGE.LOGIN)
    dispatch(logout())
  }

  return useMutation<string | undefined, AxiosError<ErrorResponse>, unknown>({
    mutationFn: async () => await postLogout(),
    onSuccess: () => {
      destroySession()
    },
    onError: (error) => {
      if (error.response?.data.code === "token_not_valid") {
        destroySession()
      } else {
        toast(
          error.response?.data.detail ||
            error.response?.data.non_field_errors?.join(", ") ||
            "An error occurred."
        )
      }
    }
  })
}
