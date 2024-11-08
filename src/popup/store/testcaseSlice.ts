import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { type Testcase } from "../types/testcase"

const testcaseSlice = createSlice({
  name: "testcase",
  initialState: { testcase: null } as { testcase?: Testcase | null },
  reducers: {
    changeTestcase: (state, { payload }: PayloadAction<Testcase>) => {
      state.testcase = payload
    },
    resetTestcase: (state) => {
      state.testcase = null
    }
  }
})

export const { changeTestcase, resetTestcase } = testcaseSlice.actions
export default testcaseSlice.reducer
