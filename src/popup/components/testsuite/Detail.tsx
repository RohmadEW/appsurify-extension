import { useState } from "react"
import { BiEdit, BiTrash } from "react-icons/bi"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

import { useDeleteTestsuite } from "../../hooks/testsuite/useDeleteTestsuite"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import { changeTestsuite, resetTestsuite } from "../../store/testsuiteSlice"
import { type Testsuite } from "../../types/testsuite"
import { FormTestsuite } from "./Form"

interface DetailTestsuiteProps {
  testsuite: Testsuite
}

export const DetailTestsuite = ({ testsuite }: DetailTestsuiteProps) => {
  const { setRouterPage } = useRouter()
  const { testsuite: testsuiteStore } = useAppSelector(
    (state) => state.testsuite
  )
  const dispatch = useAppDispatch()

  const [showForm, setShowForm] = useState(false)
  const { mutate: deleteTestsuite, isPending: deleting } = useDeleteTestsuite()

  const handleTestsuiteSelected = () => {
    dispatch(changeTestsuite(testsuite))
    setRouterPage(ROUTE_PAGE.TESTCASE)
  }

  const handleDeleteTestsuite = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (window.confirm("Are you sure you want to delete this testsuite?")) {
      deleteTestsuite(
        { id: testsuite.id },
        {
          onSuccess: () => {
            if (testsuiteStore?.id === testsuite.id) {
              dispatch(resetTestsuite())
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
    <div key={testsuite.id}>
      <div
        className={`plasmo-btn plasmo-w-full ${
          testsuiteStore?.id === testsuite.id
            ? "plasmo-btn-primary"
            : "plasmo-btn-primary plasmo-btn-outline"
        }`}
        onClick={handleTestsuiteSelected}>
        <div className="plasmo-flex plasmo-items-center plasmo-w-full">
          <div className="plasmo-mr-auto">{testsuite.name}</div>
          <button onClick={handleShowForm} className="plasmo-p-2">
            <BiEdit className="plasmo-w-[20px] plasmo-h-[20px]" />
          </button>
          <button onClick={handleDeleteTestsuite} className="plasmo-p-2">
            {deleting ? (
              <div className="plasmo-loading plasmo-loading-spinner plasmo-loading-sm"></div>
            ) : (
              <BiTrash className="plasmo-w-[20px] plasmo-h-[20px]" />
            )}
          </button>
        </div>
      </div>
      <FormTestsuite
        showForm={showForm}
        testsuite={testsuite}
        onShowForm={setShowForm}
      />
    </div>
  )
}
