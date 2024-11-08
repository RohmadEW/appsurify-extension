import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { type Project } from "../types/project"

const projectSlice = createSlice({
  name: "project",
  initialState: { project: null } as { project?: Project | null },
  reducers: {
    changeProject: (state, { payload }: PayloadAction<Project>) => {
      state.project = payload
    },
    resetProject: (state) => {
      state.project = null
    }
  }
})

export const { changeProject, resetProject } = projectSlice.actions
export default projectSlice.reducer
