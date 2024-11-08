import { useState } from "react"
import { BiChevronLeft } from "react-icons/bi"
import { PiPlus } from "react-icons/pi"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

import { useTestcase } from "../../hooks/testcase/useTestcase"
import { useAppSelector } from "../../hooks/useStore"
import { initialPagination, type Pagination } from "../../types/pagination"
import { DetailTestcase } from "./Detail"
import { FormTestcase } from "./Form"
import { LoadingTestCase } from "./Loading"

export default function ListTestCase() {
  const { testsuite } = useAppSelector((state) => state.testsuite)
  const [pagination] = useState<Pagination>(initialPagination)
  const { data: testcases, isLoading } = useTestcase({ pagination })
  const [showForm, setShowForm] = useState(false)
  const { setRouterPage } = useRouter()

  if (isLoading) {
    return <LoadingTestCase />
  }

  return (
    <div className="plasmo-divide-y">
      <div className="plasmo-px-4 plasmo-py-3 plasmo-pr-4 plasmo-flex plasmo-items-center plasmo-gap-1">
        <button
          className="plasmo-p-1 hover:plasmo-bg-gray-200 plasmo-rounded-full"
          onClick={() => setRouterPage(ROUTE_PAGE.TESTSUITE)}>
          <BiChevronLeft className="plasmo-text-[#6B7280] plasmo-w-8 plasmo-h-8" />
        </button>
        <div className="plasmo-mr-auto">
          <div className="plasmo-text-[12px]">{testsuite?.name}</div>
          <div className="plasmo-text-[18px] plasmo-font-bold">Test Case</div>
        </div>
        <button
          className="plasmo-btn plasmo-btn-ghost"
          onClick={() => setShowForm(true)}>
          <PiPlus className="plasmo-text-[20px] plasmo-text-[#333333]" />
        </button>
      </div>
      <FormTestcase showForm={showForm} onShowForm={setShowForm} />
      <div className="plasmo-p-[16px] plasmo-h-[calc(100vh-112px)] plasmo-divide-y plasmo-overflow-y-auto plasmo-space-y-3">
        {testcases?.results.map((testcase) => (
          <DetailTestcase key={testcase.id} testcase={testcase} />
        ))}
        {testcases?.results?.length === 0 && (
          <div className="plasmo-text-[#757575] plasmo-italic plasmo-text-sm">
            No test suites found
          </div>
        )}
      </div>
    </div>
  )
}
