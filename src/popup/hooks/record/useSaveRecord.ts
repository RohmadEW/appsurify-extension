import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { postRecord, type PostRecordArgs } from "~popup/api/record/postRecord"

import { type ErrorResponse } from "../../types/response"

export const useSaveRecord = () => {
  return useMutation<
    string | undefined,
    AxiosError<ErrorResponse>,
    PostRecordArgs
  >({
    mutationFn: async (args) => await postRecord(args),
    onSuccess: () => {
      toast("Record saved.")
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
