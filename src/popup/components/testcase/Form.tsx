import React, { useRef, useState } from "react"
import { BiSave } from "react-icons/bi"
import { IoMdCloseCircle } from "react-icons/io"

import { useCreateTestcase } from "../../hooks/testcase/useCreateTestcase"
import { useUpdateTestcase } from "../../hooks/testcase/useUpdateTestcase"
import { type Testcase } from "../../types/testcase"

interface FormTestcaseProps {
  showForm?: boolean
  onShowForm?: (showForm: boolean) => void
  testcase?: Testcase
}

export const FormTestcase = ({
  showForm,
  onShowForm,
  testcase
}: FormTestcaseProps) => {
  const isEdit = !!testcase
  const [name, setName] = useState<string>(testcase?.name || "")
  const modalRef = useRef<HTMLDialogElement>(null)

  const { mutate: createTestcase, isPending: creating } = useCreateTestcase()
  const { mutate: updateTestcase, isPending: updating } = useUpdateTestcase()

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
      updateTestcase(
        { id: testcase.id, name },
        {
          onSuccess: () => {
            onShowForm?.(false)
            setName("")
          }
        }
      )
    } else {
      createTestcase(
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
              {isEdit ? "Update" : "Create"} Test Case
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
            placeholder="Test case name"
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
