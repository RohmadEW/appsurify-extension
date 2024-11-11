import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Recording } from "~popup/types/recording"
import type { Team } from "~popup/types/team"
import type { Testcase } from "~popup/types/testcase"
import type { Testsuite } from "~popup/types/testsuite"

import { type Project } from "../types/project"

const recordingSlice = createSlice({
  name: "recording",
  initialState: {} as Partial<Recording>,
  reducers: {
    setTeam: (state, { payload }: PayloadAction<Team>) => {
      state.team = payload
    },
    setProject: (state, { payload }: PayloadAction<Project>) => {
      state.project = payload
    },
    setTestsuite: (state, { payload }: PayloadAction<Testsuite>) => {
      state.testsuite = payload
    },
    setTestcase: (state, { payload }: PayloadAction<Testcase>) => {
      state.testcase = payload
    },
    setTestrun: (state, { payload }: PayloadAction<string>) => {
      state.testrun = payload
    },
    setRrwebSessionKey: (state, { payload }: PayloadAction<string>) => {
      state.rrwebSessionKey = payload
    },
    setRrwebPageKey: (state, { payload }: PayloadAction<string>) => {
      state.rrwebPageKey = payload
    },
    resetRecording: (state) => {
      state.team = undefined
      state.project = undefined
      state.testsuite = undefined
      state.testcase = undefined
      state.testrun = undefined
      state.rrwebSessionKey = undefined
      state.rrwebPageKey = undefined
      state.rrwebEvents = undefined
    }
  }
})

export const {
  setTeam,
  setProject,
  setTestsuite,
  setTestcase,
  setTestrun,
  setRrwebSessionKey,
  setRrwebPageKey,
  resetRecording
} = recordingSlice.actions
export default recordingSlice.reducer
