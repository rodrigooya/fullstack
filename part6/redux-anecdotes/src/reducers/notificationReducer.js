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

export const { notification } = notificationSlice.actions
export default notificationSlice.reducer