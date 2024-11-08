import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./authSlice"
import projectSlice from "./projectSlice"
import teamReducer from "./teamSlice"
import testcaseReducer from "./testcaseSlice"
import testsuiteReducer from "./testsuiteSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    project: projectSlice,
    testsuite: testsuiteReducer,
    testcase: testcaseReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
