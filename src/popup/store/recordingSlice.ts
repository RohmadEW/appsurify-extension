import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Recording } from "~popup/types/recording"

const recordingSlice = createSlice({
  name: "recording",
  initialState: {} as Partial<Recording>,
  reducers: {
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
      state.testrun = undefined
      state.rrwebSessionKey = undefined
      state.rrwebPageKey = undefined
      state.rrwebEvents = undefined
    }
  }
})

export const {
  setTestrun,
  setRrwebSessionKey,
  setRrwebPageKey,
  resetRecording
} = recordingSlice.actions
export default recordingSlice.reducer
