import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { postProject } from "../../api/project/postProject"
import { type Project } from "../../types/project"
import { type ErrorResponse } from "../../types/response"
import { useAppSelector } from "../useStore"

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const { team } = useAppSelector((state) => state.team)

  return useMutation<
    Project | undefined,
    AxiosError<ErrorResponse>,
    { name: string }
  >({
    mutationFn: async ({ name }) =>
      team
        ? await postProject({
            team,
            name
          })
        : undefined,
    onSuccess: () => {
      toast("Project created.")
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
