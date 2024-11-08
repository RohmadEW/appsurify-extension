import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { putTestcase } from "../../api/testcase/putTestcase"
import { type ErrorResponse } from "../../types/response"
import { type Testcase } from "../../types/testcase"
import { useAppSelector } from "../useStore"

export const useUpdateTestcase = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)
  const { testsuite } = useAppSelector((state) => state.testsuite)

  return useMutation<
    Testcase | undefined,
    AxiosError<ErrorResponse>,
    { id: number; name: string }
  >({
    mutationFn: async ({ id, name }) =>
      team && project && testsuite
        ? await putTestcase({
            team,
            project,
            testsuite,
            id,
            name
          })
        : undefined,
    onSuccess: () => {
      toast("Testcase updated.")
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
