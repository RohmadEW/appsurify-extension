import { useStorage } from "@plasmohq/storage/hook"

import { StorageKey } from "~types/storage"

export default function Recording() {
  const [projects] = useStorage<string[]>(StorageKey.PROJECTS, (value) =>
    typeof value === "undefined" ? [] : value
  )

  return (
    <div className="plasmo-mt-6">
      {projects.length === 0 && (
        <div className="plasmo-text-center plasmo-text-gray-500 plasmo-text-base">
          No projects found
        </div>
      )}
      <div className="plasmo-mt-6 plasmo-space-y-2">
        {projects.map((project) => (
          <button
            key={project}
            className="plasmo-btn plasmo-btn-outline plasmo-w-full">
            {project}
          </button>
        ))}
      </div>
    </div>
  )
}
