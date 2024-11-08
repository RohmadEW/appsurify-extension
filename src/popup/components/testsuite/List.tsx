import { useState } from "react"
import { BiChevronLeft } from "react-icons/bi"
import { PiPlus } from "react-icons/pi"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

import { useTestsuite } from "../../hooks/testsuite/useTestsuite"
import { useAppSelector } from "../../hooks/useStore"
import { initialPagination, type Pagination } from "../../types/pagination"
import { DetailTestsuite } from "./Detail"
import { FormTestsuite } from "./Form"
import { LoadingTestSuite } from "./Loading"

export default function ListTestSuite() {
  const { project } = useAppSelector((state) => state.project)
  const [pagination] = useState<Pagination>(initialPagination)
  const { data: testsuites, isLoading } = useTestsuite({ pagination })
  const [showForm, setShowForm] = useState(false)
  const { setRouterPage } = useRouter()

  if (isLoading) {
    return <LoadingTestSuite />
  }

  return (
    <div className="plasmo-divide-y">
      <div className="plasmo-px-4 plasmo-py-3 plasmo-pr-4 plasmo-flex plasmo-items-center plasmo-gap-1">
        <button
          className="plasmo-p-1 hover:plasmo-bg-gray-200 plasmo-rounded-full"
          onClick={() => setRouterPage(ROUTE_PAGE.HOME)}>
          <BiChevronLeft className="plasmo-text-[#6B7280] plasmo-w-8 plasmo-h-8" />
        </button>
        <div className="plasmo-mr-auto">
          <div className="plasmo-text-[12px]">{project?.name}</div>
          <div className="plasmo-text-[18px] plasmo-font-bold">Test Suite</div>
        </div>
        <button
          className="plasmo-btn plasmo-btn-ghost"
          onClick={() => setShowForm(true)}>
          <PiPlus className="plasmo-text-[20px] plasmo-text-[#333333]" />
        </button>
      </div>
      <FormTestsuite showForm={showForm} onShowForm={setShowForm} />
      <div className="plasmo-p-[16px] plasmo-h-[calc(100vh-112px)] plasmo-divide-y plasmo-overflow-y-auto plasmo-space-y-3">
        {testsuites?.results.map((testsuite) => (
          <DetailTestsuite key={testsuite.id} testsuite={testsuite} />
        ))}
        {testsuites?.results?.length === 0 && (
          <div className="plasmo-text-[#757575] plasmo-italic plasmo-text-sm">
            No test suites found
          </div>
        )}
      </div>
    </div>
  )
}
