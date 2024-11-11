import { useEffect } from "react"

import { useTeam } from "~popup/hooks/team/useTeam"
import { useAppDispatch, useAppSelector } from "~popup/hooks/useStore"
import { changeTeam } from "~popup/store/teamSlice"

export const TeamRecording = () => {
  const { team } = useAppSelector((state) => state.team)
  const dispatch = useAppDispatch()

  const { data: teams, isLoading } = useTeam()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamSelected = teams?.results?.find(
      (it) => it.id === Number(event.target.value)
    )
    if (!teamSelected) {
      dispatch(changeTeam(teamSelected))
    }
  }

  useEffect(() => {
    if (teams?.results.length) {
      dispatch(changeTeam(teams?.results[0]))
    }
  }, [teams])

  if (isLoading) {
    return (
      <div className="plasmo-skeleton plasmo-w-full plasmo-h-[50px] plasmo-rounded-md"></div>
    )
  }

  return (
    <select
      className="plasmo-select plasmo-select-bordered plasmo-w-full"
      value={teams?.results.find((it) => it.id === team?.id)?.id}
      onChange={handleChange}>
      {teams?.results.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}
