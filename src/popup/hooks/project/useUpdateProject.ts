import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { putProject } from "../../api/project/putProject"
import { type Project } from "../../types/project"
import { type ErrorResponse } from "../../types/response"
import { useAppSelector } from "../useStore"

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)

  return useMutation<
    Project | undefined,
    AxiosError<ErrorResponse>,
    { id: number; name: string }
  >({
    mutationFn: async ({ id, name }) =>
      team
        ? await putProject({
            team,
            id,
            name
          })
        : undefined,
    onSuccess: () => {
      toast("Project updated.")
      queryClient.invalidateQueries({ queryKey: ["projects"] })
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
