import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [addMessage, setAddMessage] = useState(null)
  const [value, setValue] = useState(true)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ newTitle, setNewTitle ] = useState('')
  const [ newAuthor, setNewAuthor ] = useState('')
  const [ newUrl, setNewUrl ] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setValue(true)
      setAddMessage(
        `${error.response.data.error}`
      )
      setTimeout(() => {
        setAddMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = event => {
    event.preventDefault()
    const createBlog = ({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    blogFormRef.current.toggleVisibility()
    blogService
      .create(createBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
    setValue(false)
    setAddMessage(`Added '${newTitle}' `)
    setTimeout(() => {
      setAddMessage(null)
    }, 5000)
  }

  const addLikes = id => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
  }

  const removeBlog = id => {
    const blog = blogs.find(n => n.id === id)
    if (window.confirm(`Remove Blog ${blog.title} by ${blog.author}`)){
      window.open('exit.html', 'Thanks for Visiting!')
      blogService
        .deleteData(blog.id)
        .then(returnedBlog => {
          setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
        })
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Notification message={addMessage} value={value}/>
      <h2>blogs</h2>
      <div>
        {!user && loginForm()}
        {user &&
            <div>
              <p>{user.name} logged in <button onClickCapture={logout}>logout</button></p>
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm
                  title={newTitle}
                  author={newAuthor}
                  url={newUrl}
                  handleTitleChange={({ target }) => setNewTitle(target.value)}
                  handleAuthorChange={({ target }) => setNewAuthor(target.value)}
                  handleUrlChange={({ target }) => setNewUrl(target.value)}
                  handleSubmit={addBlog}
                />
              </Togglable>
            </div>
        }
      </div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLikes={addLikes}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
    </div>
  )
}

export default App