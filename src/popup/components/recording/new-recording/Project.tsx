import { useEffect, useState } from "react"

import { useProject } from "~popup/hooks/project/useProject"
import { useCustomCookies } from "~popup/hooks/useCustomCookies"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { changeProject } from "~popup/store/projectSlice"
import { initialPagination, type Pagination } from "~popup/types/pagination"

export const ProjectRecording = () => {
  const [pagination] = useState<Pagination>(initialPagination)
  const { setProjectId } = useCustomCookies()
  const { team } = useAppSelector((state) => state.team)
  const { project } = useAppSelector((state) => state.project)
  const dispatch = useAppDispatch()

  const { data: projects, isLoading } = useProject({
    pagination
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectSelected = projects?.results?.find(
      (it) => it.id === Number(event.target.value)
    )
    if (projectSelected) {
      setProjectId(projectSelected.id)
      dispatch(changeProject(projectSelected))
    }
  }

  useEffect(() => {
    if (projects?.results.length) {
      dispatch(changeProject(projects?.results[0]))
    }
  }, [projects])

  if (!team) {
    return null
  }

  if (isLoading) {
    return (
      <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-rounded-md"></div>
    )
  }

  if (!projects?.results.length) {
    return (
      <div className="plasmo-text-sm plasmo-text-gray-500 plasmo-mt-2">
        No projects found
      </div>
    )
  }

  return (
    <select
      className="plasmo-select plasmo-select-bordered plasmo-w-full"
      value={projects?.results.find((it) => it.id === project?.id)?.id}
      onChange={handleChange}>
      {projects?.results.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
