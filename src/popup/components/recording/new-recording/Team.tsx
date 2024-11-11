import { useTeam } from "~popup/hooks/team/useTeam"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { setTeam } from "~popup/store/recordingSlice"

export const TeamRecording = () => {
  const { team } = useAppSelector((state) => state.recording)
  const dispatch = useAppDispatch()

  const { data: teams, isLoading } = useTeam()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamSelected = teams?.results?.find(
      (it) => it.id === Number(event.target.value)
    )
    dispatch(setTeam(teamSelected))
  }

  if (isLoading) {
    return <div className="plasmo-skeleton plasmo-w-full h-[200px]"></div>
  }

  return (
    <select
      className="plasmo-select plasmo-select-bordered plasmo-w-full"
      value={teams?.results.find((it) => it.id === team?.id)?.id}
      onChange={handleChange}>
      <option value="">Teams</option>
      {teams?.results.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
