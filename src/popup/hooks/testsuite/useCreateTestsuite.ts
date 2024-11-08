import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { postTestsuite } from "../../api/testsuite/postTestsuite"
import { type ErrorResponse } from "../../types/response"
import { type Testsuite } from "../../types/testsuite"
import { useAppSelector } from "../useStore"

export const useCreateTestsuite = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)

  return useMutation<
    Testsuite | undefined,
    AxiosError<ErrorResponse>,
    { name: string }
  >({
    mutationFn: async ({ name }) =>
      team && project
        ? await postTestsuite({
            team,
            project,
            name
          })
        : undefined,
    onSuccess: () => {
      toast("Testsuite created.")
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
