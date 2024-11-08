import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { deleteProject } from "../../api/project/deleteProject"
import { type Project } from "../../types/project"
import { type ErrorResponse } from "../../types/response"
import { useAppSelector } from "../useStore"

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)

  return useMutation<
    Project | undefined,
    AxiosError<ErrorResponse>,
    { id: number }
  >({
    mutationFn: async ({ id }) =>
      team
        ? await deleteProject({
            team,
            id
          })
        : undefined,
    onSuccess: () => {
      toast("Project deleted.")
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
