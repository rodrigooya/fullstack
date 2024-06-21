import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addVotes(state, action) {
      return state.map((blog) =>
        blog.id !== action.payload.id ? blog : action.payload,
      )
    },
    removeBlog(state, action) {
      state.splice(
        state.findIndex((blog) => blog.id === action.payload),
        1,
      )
    },

    appendBlog(state, action) {
      state.push(action.payload)
    },

    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch(appendBlog(newBlog))
  }
}

export const updateBlog = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const blogToChange = blogs.find((n) => n.id === id)
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1,
    }
    const blog = await blogService.update(id, changedBlog)
    dispatch(addVotes(blog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const blogToDelete = blogs.find((n) => n.id === id)
    const blog = await blogService.remove(id, blogToDelete)
    dispatch(removeBlog(blog))
  }
}

export const { addVotes, appendBlog, setBlogs, removeBlog } = blogSlice.actions
export default blogSlice.reducer
