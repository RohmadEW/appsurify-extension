import { useState } from "react"
import { BiEdit, BiTrash } from "react-icons/bi"

import { useDeleteTestcase } from "../../hooks/testcase/useDeleteTestcase"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import { changeTestcase, resetTestcase } from "../../store/testcaseSlice"
import { type Testcase } from "../../types/testcase"
import { FormTestcase } from "./Form"

interface DetailTestcaseProps {
  testcase: Testcase
}

export const DetailTestcase = ({ testcase }: DetailTestcaseProps) => {
  const { testsuite } = useAppSelector((state) => state.testsuite)
  const { testcase: testcaseStore } = useAppSelector((state) => state.testcase)
  const dispatch = useAppDispatch()

  const [showForm, setShowForm] = useState(false)
  const { mutate: deleteTestcase, isPending: deleting } = useDeleteTestcase()

  const handleTestcaseSelected = () => {
    dispatch(changeTestcase(testcase))
  }

  const handleDeleteTestcase = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (window.confirm("Are you sure you want to delete this testcase?")) {
      deleteTestcase(
        { id: testcase.id },
        {
          onSuccess: () => {
            if (testcaseStore?.id === testcase.id) {
              dispatch(resetTestcase())
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
    <div key={testcase.id}>
      <div
        className="plasmo-btn plasmo-w-full plasmo-btn-primary plasmo-btn-outline"
        onClick={handleTestcaseSelected}>
        <div className="plasmo-flex plasmo-items-center plasmo-w-full">
          <div className="plasmo-mr-auto">{testcase.name}</div>
          <button onClick={handleShowForm} className="plasmo-p-3">
            <BiEdit className="plasmo-w-[20px] plasmo-h-[20px]" />
          </button>
          <button onClick={handleDeleteTestcase} className="plasmo-p-3">
            {deleting ? (
              <div className="plasmo-loading plasmo-loading-spinner plasmo-loading-sm"></div>
            ) : (
              <BiTrash className="plasmo-w-[20px] plasmo-h-[20px]" />
            )}
          </button>
        </div>
      </div>
      <FormTestcase
        showForm={showForm}
        testcase={testcase}
        onShowForm={setShowForm}
      />
    </div>
  )
}
