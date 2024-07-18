const router = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const userExtractor = require('../utils/middleware').userExtractor

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { name: 1, username: 1 })
    .populate('comments')
  response.json(blogs)
})

router.post('/:blogId/comments', async (request, response) => {
  const { blogId } = request.params
  const comment = new Comment(request.body)
  const savedComment = await comment.save()
  const blog = await Blog.findById(blogId)
  console.log(savedComment.comment)
  blog.comments.push(savedComment._id)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

router.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  const user = request.user

  if (!user) {
    return response.status(403).json({ error: 'user missing' })
  }

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  blog.likes = blog.likes | 0
  blog.user = user
  user.blogs = user.blogs.concat(blog._id)

  await user.save()

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(204).end()
  }

  if (blog.user && user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  await blog.deleteOne()

  user.blogs = user.blogs.filter(
    (b) => b._id.toString() !== blog._id.toString(),
  )

  await user.save()

  response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = router
