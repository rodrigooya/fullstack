import { createSlice } from '@reduxjs/toolkit'

import loginService from '../services/login'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const Login = () => {
  return async (dispatch) => {
    const users = await loginService.login()
    dispatch(setUser(users))
  }
}

export const { setUser } = userSlice.actions
export default userSlice.reducer
