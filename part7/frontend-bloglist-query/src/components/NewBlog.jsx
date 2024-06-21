import { useNotify } from '../NotificationContext'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { createBlog } from '../requests'
import { createRef } from 'react'

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
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" data-testid="title" name="title" />
        </div>
        <div>
          <label>URL:</label>
          <input type="text" data-testid="url" name="url" />
        </div>
        <div>
          <label>Author:</label>
          <input type="text" data-testid="author" name="author" />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog
