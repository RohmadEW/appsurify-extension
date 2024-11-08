import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { deleteTestcase } from "../../api/testcase/deleteTestcase"
import { type ErrorResponse } from "../../types/response"
import { type Testcase } from "../../types/testcase"
import { useAppSelector } from "../useStore"

export const useDeleteTestcase = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)
  const { testsuite } = useAppSelector((state) => state.testsuite)

  return useMutation<
    Testcase | undefined,
    AxiosError<ErrorResponse>,
    { id: number }
  >({
    mutationFn: async ({ id }) =>
      team && project && testsuite
        ? await deleteTestcase({
            team,
            project,
            testsuite,
            id
          })
        : undefined,
    onSuccess: () => {
      toast("Testcase deleted.")
      queryClient.invalidateQueries({ queryKey: ["testcases"] })
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
