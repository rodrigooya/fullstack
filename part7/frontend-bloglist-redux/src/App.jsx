import { useState, useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { setNotification } from './reducers/notificationReducer'

import {
  createBlog,
  deleteBlog,
  initializeBlogs,
  updateBlog,
} from './reducers/blogReducer'

const App = () => {
  const [user, setUser] = useState(null)
  const blogs = useSelector(({ blogs }) => {
    if (blogs) {
      return blogs
    }
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      setUser(user)
    }
  }, [])

  const blogFormRef = createRef()

  const handleLogin = async (credentials) => {
    try {
      dispatch(Login(credentials))
      storage.saveUser(user)
      dispatch(setNotification(`Welcome back, ${user.name}`, 5000))
    } catch (error) {
      dispatch(setNotification('Wrong credentials', 'error', 5000))
    }
  }

  const handleCreate = async (blog) => {
    dispatch(createBlog(blog))
    dispatch(
      setNotification(`Blog created: ${blog.title}, ${blog.author}`, 5000),
    )
    blogFormRef.current.toggleVisibility()
  }

  const handleVote = async (blog) => {
    console.log('updating', blog)
    dispatch(updateBlog(blog.id))
    dispatch(setNotification(`You liked ${blog.title} by ${blog.author}`, 5000))
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    dispatch(setNotification(`Bye, ${user.name}!`, 5000))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(
        setNotification(`Blog ${blog.title}, by ${blog.author} removed`, 5000),
      )
    }
  }

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      {[...blogs].sort(byLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default App
