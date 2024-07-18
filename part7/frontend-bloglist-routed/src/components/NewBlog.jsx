import { useNotify } from '../NotificationContext'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { createBlog } from '../requests'
import { createRef } from 'react'
import { Form, Button } from 'react-bootstrap'

const NewBlog = () => {
  const queryClient = useQueryClient()
  const notifyWith = useNotify()

  const blogFormRef = createRef()

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notifyWith(`Blog created: ${newBlog.title}, ${newBlog.author}`)
      blogFormRef.current.toggleVisibility()
    },
    onError: (error) => {
      notifyWith(`'${error.response.data.error}' `)
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const title = event.target.title.value
    event.target.title.value = ''
    const url = event.target.url.value
    event.target.url.value = ''
    const author = event.target.author.value
    event.target.author.value = ''
    newBlogMutation.mutate({ title, url, author, likes: 0 })
  }

  return (
    <div>
      <h2>Create a New Blog</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control type="text" data-testid="title" name="title" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control type="text" data-testid="author" name="author" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Url:</Form.Label>
          <Form.Control type="text" data-testid="url" name="url" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  )
}

export default NewBlog
