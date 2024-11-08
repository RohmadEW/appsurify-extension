import { useState } from "react"
import { GoPlus } from "react-icons/go"

import { useProject } from "../../hooks/project/useProject"
import { type Pagination } from "../../types/pagination"
import { DetailProject } from "./Detail"
import { FormProject } from "./Form"

export default function ProjectMain() {
  const [pagination] = useState<Pagination>({ page: 1 })
  const { data, isLoading } = useProject({ pagination })
  const [showForm, setShowForm] = useState(false)

  if (isLoading) {
    return (
      <>
        <div className="plasmo-mt-[32px] plasmo-text-[16px] plasmo-text-[#757575]">
          Projects
        </div>
        <div>
          <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-mt-[16px] plasmo-rounded-md"></div>
          <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-mt-[16px] plasmo-rounded-md"></div>
          <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-mt-[16px] plasmo-rounded-md"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="plasmo-mt-[32px] plasmo-text-[16px] plasmo-text-[#757575]">
        Projects
      </div>
      <div>
        {data?.results?.map((project) => (
          <DetailProject key={project.id} project={project} />
        ))}
      </div>
      {data?.results?.length === 0 && (
        <div className="plasmo-mt-[16px] plasmo-text-[#757575] plasmo-italic plasmo-text-sm">
          No projects found
        </div>
      )}
      <div>
        <FormProject showForm={showForm} onShowForm={setShowForm} />
        <div className="plasmo-mt-[32px]">
          <button
            className="plasmo-btn plasmo-btn-primary plasmo-btn-outline plasmo-w-full plasmo-font-normal"
            onClick={() => setShowForm(true)}>
            <GoPlus className="plasmo-w-[20px] plasmo-h-[20px]" />
            Create New Project
          </button>
        </div>
      </div>
    </>
  )
}
