import { BiChevronLeft } from "react-icons/bi"

import { useRouter } from "~popup/hooks/useRouter"
import { ROUTE_PAGE } from "~popup/types/route"

export const LoadingTestCase = () => {
  const { setRouterPage } = useRouter()

  return (
    <div className="plasmo-divide-y">
      <div className="plasmo-px-4 plasmo-py-3 plasmo-pr-4 plasmo-flex plasmo-items-center plasmo-gap-1">
        <button
          className="plasmo-p-1 hover:plasmo-bg-gray-200 plasmo-rounded-full"
          onClick={() => setRouterPage(ROUTE_PAGE.TESTSUITE)}>
          <BiChevronLeft className="plasmo-text-[#6B7280] plasmo-w-8 plasmo-h-8" />
        </button>
        <div className="plasmo-text-[18px] plasmo-font-bold">Test Case</div>
      </div>
      <div className="plasmo-p-[16px] plasmo-space-y-3">
        <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-rounded-md"></div>
        <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-rounded-md"></div>
        <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-rounded-md"></div>
      </div>
    </div>
  )
}
