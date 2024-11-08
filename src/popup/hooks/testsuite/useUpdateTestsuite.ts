import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { putTestsuite } from "../../api/testsuite/putTestsuite"
import { type ErrorResponse } from "../../types/response"
import { type Testsuite } from "../../types/testsuite"
import { useAppSelector } from "../useStore"

export const useUpdateTestsuite = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)

  return useMutation<
    Testsuite | undefined,
    AxiosError<ErrorResponse>,
    { id: number; name: string }
  >({
    mutationFn: async ({ id, name }) =>
      team && project
        ? await putTestsuite({
            team,
            project,
            id,
            name
          })
        : undefined,
    onSuccess: () => {
      toast("Testsuite updated.")
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
