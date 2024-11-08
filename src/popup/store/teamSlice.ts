import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { type Team } from "../types/team"

const teamSlice = createSlice({
  name: "team",
  initialState: { team: null } as { team?: Team | null },
  reducers: {
    changeTeam: (state, { payload }: PayloadAction<Team>) => {
      state.team = payload
    },
    resetTeam: (state) => {
      state.team = null
    }
  }
})

export const { changeTeam, resetTeam } = teamSlice.actions
export default teamSlice.reducer
