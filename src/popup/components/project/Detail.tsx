import { useState } from "react"
import { BiEdit, BiTrash } from "react-icons/bi"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

import { useDeleteProject } from "../../hooks/project/useDeleteProject"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import { changeProject, resetProject } from "../../store/projectSlice"
import { type Project } from "../../types/project"
import { FormProject } from "./Form"

interface DetailProjectProps {
  project: Project
}

export const DetailProject = ({ project }: DetailProjectProps) => {
  const { project: projectStore } = useAppSelector((state) => state.project)
  const dispatch = useAppDispatch()
  const { setRouterPage } = useRouter()

  const [showForm, setShowForm] = useState(false)
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject()

  const handleProjectSelected = () => {
    dispatch(changeProject(project))
    setRouterPage(ROUTE_PAGE.TESTSUITE)
  }

  const handleDeleteProject = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(
        { id: project.id },
        {
          onSuccess: () => {
            if (projectStore?.id === project.id) {
              dispatch(resetProject())
            }
          }
        }
      )
    }
  }

  const handleShowForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    setShowForm(true)
  }

  return (
    <div key={project.id} className="plasmo-mt-[16px]">
      <div
        className="plasmo-btn plasmo-w-full plasmo-btn-primary plasmo-btn-outline"
        onClick={handleProjectSelected}>
        <div className="plasmo-flex plasmo-items-center plasmo-w-full">
          <div className="plasmo-mr-auto">{project.name}</div>
          <button onClick={handleShowForm} className="plasmo-p-2">
            <BiEdit className="plasmo-w-[20px] plasmo-h-[20px]" />
          </button>
          <button onClick={handleDeleteProject} className="plasmo-p-2">
            {deleting ? (
              <div className="plasmo-loading plasmo-loading-spinner plasmo-loading-sm"></div>
            ) : (
              <BiTrash className="plasmo-w-[20px] plasmo-h-[20px]" />
            )}
          </button>
        </div>
      </div>
      <FormProject
        showForm={showForm}
        project={project}
        onShowForm={setShowForm}
      />
    </div>
  )
}
