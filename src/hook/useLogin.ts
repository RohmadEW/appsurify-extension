import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import type { ErrorResponse } from "~types/response"

import type { PostLoginArgs } from "../api/postLogin"
import { postLogin } from "../api/postLogin"
import type { JWT } from "../types/auth"

export const useLogin = () => {
  return useMutation<JWT, AxiosError<ErrorResponse>, PostLoginArgs>({
    mutationFn: async (args) => await postLogin(args),
    onSuccess: (jwt: JWT) => {
      toast("Login successful.")
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
