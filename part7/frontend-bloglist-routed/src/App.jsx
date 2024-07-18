import { useState, useEffect, createRef, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from './NotificationContext'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import PropTypes from 'prop-types'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import {
  getBlogs,
  updateBlog,
  deleteBlog,
  getUsers,
  createComment,
} from './requests'
import {
  Routes,
  Route,
  Link,
  useMatch,
  useParams,
  useNavigate,
} from 'react-router-dom'
import { Table, Navbar, Nav, Form, Button } from 'react-bootstrap'

const Menu = ({
  blogs,
  blog,
  users,
  userblog,
  user,
  handleLogout,
  handleLogin,
  handleVote,
  handleDelete,
  handleComment,
}) => {
  const padding = {
    paddingRight: 5,
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">
                blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">
                users
              </Link>
            </Nav.Link>
            <Nav.Item className="justify-content-end">
              <Nav.Link href="#" as="span">
                {user ? (
                  <em>
                    {user.name} logged in{' '}
                    <button onClick={handleLogout}>logout</button>
                  </em>
                ) : (
                  <Link to="/login">login</Link>
                )}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Notification />
      <h2>blogs app</h2>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              handleVote={handleVote}
              handleDelete={handleDelete}
              handleComment={handleComment}
            />
          }
        />
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/users" element={<UserList users={users} />} />
        <Route
          path="/users/:id"
          element={<User blogs={blogs} user={userblog} />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  )
}
const byLikes = (a, b) => b.likes - a.likes
const BlogList = ({ blogs }) => {
  const blogFormRef = createRef()
  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog />
      </Togglable>
      <Table striped>
        <tbody>
          {blogs.sort(byLikes).map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>{blog.user.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const Blog = ({ blog, handleVote, handleDelete, handleComment }) => {
  const nameOfUser = blog.user ? blog.user.name : 'anonymous'

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const canRemove = blog.user ? blog.user.username === storage.me() : true

  return (
    <div style={style} className="blog">
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <strong> {blog.url} </strong>
      </div>
      <div>
        <strong>
          {' '}
          {blog.likes} likes
          <Button
            variant="primary"
            style={{ marginLeft: 3 }}
            onClick={() => handleVote(blog)}
          >
            like
          </Button>
        </strong>
      </div>
      <div>
        <strong> added by {blog.user.name} </strong>
      </div>
      <strong> Comments </strong>
      <Form onSubmit={handleComment}>
        <Form.Group>
          <Form.Label>comment:</Form.Label>
          <Form.Control type="text" data-testid="comment" name="comment" />
        </Form.Group>
        <Button variant="primary" type="submit">
          add Comment
        </Button>
      </Form>
      <Table striped>
        <tbody>
          {blog.comments.map((comments) => (
            <tr key={comments._id}>
              <td>{comments.comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>{nameOfUser}</div>
      {canRemove && <button onClick={() => handleDelete(blog)}>remove</button>}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object,
  }).isRequired,
  handleVote: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

const UserList = ({ users }) => (
  <div>
    <h2>Users</h2>
    <Table striped>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)

const User = ({ user, blogs }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <Table striped>
        <tbody>
          {blogs.sort(byLikes).map((blog) => {
            if (blog.user.name === user.name)
              return (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                </tr>
              )
          })}
        </tbody>
      </Table>
    </div>
  )
}

const App = () => {
  const navigate = useNavigate()
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
  })

  const resultuser = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  })

  const queryClient = useQueryClient()
  const notifyWith = useNotify()
  const [user, setUser] = useState(null)

  const users = resultuser.data
  const blogs = result.data

  const matchu = useMatch('/users/:id')
  const match = useMatch('/blogs/:id')

  const newCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      notifyWith(`'${error.response.data.error}' `)
    },
  })

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
    return <div>blog service not available due to problems in server</div>
  }

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

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    notifyWith(`Bye, ${user.name}!`)
  }

  const handleVote = (blog) => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      notifyWith(`Blog ${blog.title}, by ${blog.author} removed`)
      deleteBlogMutation.mutate({ ...blog, id: blog.id })
      navigate('/')
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''
    newCommentMutation.mutate({ ...blog, id: blog.id, comment })
  }
  const userblog = matchu
    ? users.find((user) => user.id === matchu.params.id)
    : null

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="container">
      <Menu
        blogs={blogs}
        blog={blog}
        users={users}
        userblog={userblog}
        user={user}
        handleLogout={handleLogout}
        handleVote={handleVote}
        handleDelete={handleDelete}
        handleLogin={handleLogin}
        handleComment={handleComment}
      />
    </div>
  )
}

export default App
