import { useProject } from "~popup/hooks/project/useProject"

export const ProjectRecording = () => {
  const { data: projects } = useProject()

  return (
    <select
      className="plasmo-select plasmo-select-bordered plasmo-w-full"
      value={projects.find((it) => it.id === project?.id)?.id}
      onChange={(event) => {
        setProject(projects.find((it) => it.id === event.target.value))
        setTestsuite(undefined)
      }}>
      <option value="">Projects</option>
      {projects.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
