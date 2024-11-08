import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { type Testsuite } from "../types/testsuite"

const testsuiteSlice = createSlice({
  name: "testsuite",
  initialState: { testsuite: null } as { testsuite?: Testsuite | null },
  reducers: {
    changeTestsuite: (state, { payload }: PayloadAction<Testsuite>) => {
      state.testsuite = payload
    },
    resetTestsuite: (state) => {
      state.testsuite = null
    }
  }
})

export const { changeTestsuite, resetTestsuite } = testsuiteSlice.actions
export default testsuiteSlice.reducer
