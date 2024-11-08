import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { initialAuthState, type JWT } from "../types/auth"

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, { payload }: PayloadAction<JWT>) => {
      state.isAuthenticated = !!payload.access
      state.token = payload.access
      state.refresh = payload.refresh
      state.user = payload.user
    },
    loadingStart: (state) => {
      state.isLoading = true
    },
    loadingFinish: (state) => {
      state.isLoading = false
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.refresh = null
      state.user = undefined
    }
  }
})

export const { login, logout, loadingFinish, loadingStart } = authSlice.actions
export default authSlice.reducer
