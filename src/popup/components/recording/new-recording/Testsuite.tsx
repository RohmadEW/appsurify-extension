import { useEffect, useState } from "react"

import { useTestsuite } from "~popup/hooks/testsuite/useTestsuite"
import { useCustomCookies } from "~popup/hooks/useCustomCookies"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { changeTestsuite } from "~popup/store/testsuiteSlice"
import { initialPagination, type Pagination } from "~popup/types/pagination"

export const TestsuiteRecording = () => {
  const [pagination] = useState<Pagination>(initialPagination)
  const { setTestcaseId } = useCustomCookies()
  const { project } = useAppSelector((state) => state.project)
  const { testsuite } = useAppSelector((state) => state.testsuite)
  const dispatch = useAppDispatch()

  const { data: testsuites, isLoading } = useTestsuite({
    pagination
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const testsuiteSelected = testsuites?.results?.find(
      (it) => it.id === Number(event.target.value)
    )
    if (testsuiteSelected) {
      setTestcaseId(testsuiteSelected.id)
      dispatch(changeTestsuite(testsuiteSelected))
    }
  }

  useEffect(() => {
    if (testsuites?.results.length) {
      dispatch(changeTestsuite(testsuites?.results[0]))
    }
  }, [testsuites])

  if (!project) {
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
      value={testsuites?.results.find((it) => it.id === testsuite?.id)?.id}
      onChange={handleChange}>
      {testsuites?.results.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
