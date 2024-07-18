import axios from 'axios'
import storage from './services/storage'

const baseUrl = '/api/blogs'

const getConfit = () => ({
  headers: { Authorization: `Bearer ${storage.loadUser().token}` },
})

export const getUsers = () => axios.get('/api/users').then((res) => res.data)
export const getBlogs = () => axios.get(baseUrl).then((res) => res.data)

export const createBlog = (newBlog) =>
  axios.post(baseUrl, newBlog, getConfit()).then((res) => res.data)

export const createComment = (newComment) =>
  axios
    .post(`${baseUrl}/${newComment.id}/comments`, newComment)
    .then((res) => res.data)

export const updateBlog = (updatedBlog) =>
  axios
    .put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, getConfit())
    .then((res) => res.data)
export const deleteBlog = (deletedBlog) =>
  axios
    .delete(`${baseUrl}/${deletedBlog.id}`, getConfit())
    .then((res) => res.data)
