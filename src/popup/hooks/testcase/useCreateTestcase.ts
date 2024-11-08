import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { postTestcase } from "../../api/testcase/postTestcase"
import { type ErrorResponse } from "../../types/response"
import { type Testcase } from "../../types/testcase"
import { useAppSelector } from "../useStore"

export const useCreateTestcase = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)
  const { testsuite } = useAppSelector((state) => state.testsuite)

  return useMutation<
    Testcase | undefined,
    AxiosError<ErrorResponse>,
    { name: string }
  >({
    mutationFn: async ({ name }) =>
      team && project && testsuite
        ? await postTestcase({
            team,
            project,
            testsuite,
            name
          })
        : undefined,
    onSuccess: () => {
      toast("Testcase created.")
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
