import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({  
  name: 'notification',
  initialState: null,
  reducers: {    
    notification(state, action) {   
      console.log(action.payload)   
      return action.payload 
    },    
  },
})

export const setNotification = (msg, timeout) => {
  return async dispatch => {
    dispatch(notification(msg))
    setTimeout(() => {
      dispatch(notification(null))
  }, timeout)
  }
}

export const { notification } = notificationSlice.actions
export default notificationSlice.reducer