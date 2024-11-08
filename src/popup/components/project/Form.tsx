import React, { useRef, useState } from "react"
import { BiSave } from "react-icons/bi"
import { IoMdCloseCircle } from "react-icons/io"

import { useCreateProject } from "../../hooks/project/useCreateProject"
import { useUpdateProject } from "../../hooks/project/useUpdateProject"
import { type Project } from "../../types/project"

interface FormProjectProps {
  showForm?: boolean
  onShowForm?: (showForm: boolean) => void
  project?: Project
}

export const FormProject = ({
  showForm,
  onShowForm,
  project
}: FormProjectProps) => {
  const isEdit = !!project
  const [name, setName] = useState<string>(project?.name || "")
  const modalRef = useRef<HTMLDialogElement>(null)

  const { mutate: createProject, isPending: creating } = useCreateProject()
  const { mutate: updateProject, isPending: updating } = useUpdateProject()

  React.useEffect(() => {
    if (modalRef.current) {
      if (showForm) {
        modalRef.current.showModal()
      } else {
        modalRef.current.close()
      }
    }
  }, [showForm])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!name) {
      return
    }

    if (isEdit) {
      updateProject(
        { id: project.id, name },
        {
          onSuccess: () => {
            onShowForm?.(false)
            setName("")
          }
        }
      )
    } else {
      createProject(
        { name },
        {
          onSuccess: () => {
            onShowForm?.(false)
            setName("")
          }
        }
      )
    }
  }

  return (
    <dialog ref={modalRef} className="plasmo-modal">
      <div className="plasmo-modal-box">
        <form className="plasmo-space-y-4" onSubmit={handleSubmit}>
          <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-gap-4">
            <div className="plasmo-text-lg plasmo-font-bold">
              {isEdit ? "Update" : "Create"} Project
            </div>
            <button
              className="plasmo-btn plasmo-btn-ghost plasmo-btn-sm"
              onClick={() => onShowForm?.(false)}>
              <IoMdCloseCircle className="plasmo-w-[20px] plasmo-h-[20px]" />
            </button>
          </div>
          <input
            type="text"
            className="plasmo-input plasmo-input-bordered plasmo-w-full"
            placeholder="Project name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-gap-4">
            <button
              type="button"
              className="plasmo-btn"
              disabled={creating || updating}
              onClick={() => onShowForm?.(false)}>
              Close
            </button>
            <button
              type="submit"
              className="plasmo-btn plasmo-btn-primary"
              disabled={creating || updating}>
              {creating || updating ? (
                <div className="plasmo-loading plasmo-loading-spinner plasmo-mr-1"></div>
              ) : (
                <BiSave className="plasmo-w-[20px] plasmo-h-[20px] plasmo-mr-1" />
              )}
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
