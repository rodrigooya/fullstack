import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({  
  name: 'anecdotes',  
  initialState:[],  
  reducers: {        
    addVotes(state, action) {      
      return state.map(anecdote =>
        anecdote.id !== action.payload.id ? anecdote : action.payload
      )      
    },  
    appendAnecdote(state, action) {      
      state.push(action.payload)    
    },
    setAnecdotes(state, action) {      
      return action.payload    
    }
  },
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const updateAnecdote = id => { 
  return async dispatch => {  
    const anecdotes = await anecdoteService.getAll()
    console.log(anecdotes)
    const anecdoteToChange = anecdotes.find(n => n.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange,  
        votes: anecdoteToChange.votes +1
      }
    const anecdote = await anecdoteService.update(id, changedAnecdote)    
    dispatch(addVotes(anecdote))  
  }
}

export const { addVotes, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer

