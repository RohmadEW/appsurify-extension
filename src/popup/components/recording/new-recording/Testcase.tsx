import { useEffect, useState } from "react"

import { useTestcase } from "~popup/hooks/testcase/useTestcase"
import { useCustomCookies } from "~popup/hooks/useCustomCookies"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { changeTestcase } from "~popup/store/testcaseSlice"
import { initialPagination, type Pagination } from "~popup/types/pagination"

export const TestcaseRecording = () => {
  const [pagination] = useState<Pagination>(initialPagination)
  const { setTestcaseId } = useCustomCookies()
  const { testsuite } = useAppSelector((state) => state.testsuite)
  const { testcase } = useAppSelector((state) => state.testcase)
  const dispatch = useAppDispatch()

  const { data: testcases, isLoading } = useTestcase({
    pagination
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const testcaseSelected = testcases?.results?.find(
      (it) => it.id === Number(event.target.value)
    )
    if (testcaseSelected) {
      setTestcaseId(testcaseSelected.id)
      dispatch(changeTestcase(testcaseSelected))
    }
  }

  useEffect(() => {
    if (testcases?.results.length) {
      dispatch(changeTestcase(testcases?.results[0]))
    }
  }, [testcases])

  if (!testsuite) {
    return null
  }

  if (isLoading) {
    return (
      <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-rounded-md"></div>
    )
  }

  return (
    <select
      className="plasmo-select plasmo-select-bordered plasmo-w-full"
      value={testcases?.results.find((it) => it.id === testcase?.id)?.id}
      onChange={handleChange}>
      {testcases?.results.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
