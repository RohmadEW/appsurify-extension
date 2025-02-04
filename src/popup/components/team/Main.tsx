import { useEffect } from "react"

import { useCustomCookies } from "~popup/hooks/useCustomCookies"

import { useTeam } from "../../hooks/team/useTeam"
import { useAppDispatch, useAppSelector } from "../../hooks/useStore"
import { changeTeam } from "../../store/teamSlice"

export default function TeamMain() {
  const { data: teams, isLoading } = useTeam()
  const dispatch = useAppDispatch()
  const { team } = useAppSelector((state) => state.team)
  const { setTeamId } = useCustomCookies()

  useEffect(() => {
    if (teams?.results && !team) {
      const firstTeam = teams.results[0]
      dispatch(changeTeam(firstTeam))
      setTeamId(firstTeam.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeam = teams?.results?.find(
      (it) => it.id === Number(e.target.value)
    )
    if (selectedTeam) {
      dispatch(changeTeam(selectedTeam))
      setTeamId(selectedTeam.id)
    }
  }

  if (isLoading) {
    return (
      <div className="plasmo-skeleton plasmo-w-full plasmo-h-[48px] plasmo-rounded-md"></div>
    )
  }

  return (
    <>
      <div className="plasmo-mt-[24px] plasmo-text-[16px] plasmo-text-[#757575]">
        Team
      </div>
      <select
        className="plasmo-select plasmo-select-bordered plasmo-w-full plasmo-mt-[16px]"
        value={team?.id}
        onChange={handleChange}>
        {teams?.results?.map((it) => (
          <option key={it.id} value={it.id}>
            {it.name}
          </option>
        ))}
      </select>
    </>
  )
}
