import { useState, useEffect, createRef, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from './NotificationContext'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { getBlogs, updateBlog, deleteBlog } from './requests'

const App = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
  })

  const queryClient = useQueryClient()
  const notifyWith = useNotify()
  const [user, setUser] = useState(null)

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (blog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notifyWith(`You liked ${blog.title} by ${blog.author}`)
    },
  })
  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: (blog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      setUser(user)
    }
  }, [])

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const blogFormRef = createRef()

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      storage.saveUser(user)
      notifyWith(`Welcome back, ${user.name}`)
    } catch (error) {
      notifyWith('Wrong credentials', 'error')
    }
  }

  const handleVote = (blog) => {
    console.log('updating', blog)
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    notifyWith(`Bye, ${user.name}!`)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      notifyWith(`Blog ${blog.title}, by ${blog.author} removed`)
      deleteBlogMutation.mutate({ ...blog, id: blog.id })
    }
  }
  const blogs = result.data
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
        <NewBlog />
      </Togglable>
      {blogs.sort(byLikes).map((blog) => (
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
