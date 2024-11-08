import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { deleteTestsuite } from "../../api/testsuite/deleteTestsuite"
import { type ErrorResponse } from "../../types/response"
import { type Testsuite } from "../../types/testsuite"
import { useAppSelector } from "../useStore"

export const useDeleteTestsuite = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)

  return useMutation<
    Testsuite | undefined,
    AxiosError<ErrorResponse>,
    { id: number }
  >({
    mutationFn: async ({ id }) =>
      team && project
        ? await deleteTestsuite({
            team,
            project,
            id
          })
        : undefined,
    onSuccess: () => {
      toast("Testsuite deleted.")
      queryClient.invalidateQueries({ queryKey: ["testsuites"] })
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
