const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs){
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

},300000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 6 blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 6)
})

test('verifica identificador unico', async () => {
  const response = await api.get('/api/blogs')
  const id = response.body.map(r => r.id)
  expect(id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Veamos',
    author: 'yo',
    url: 'https://reactpatterns.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain(
    'Veamos'
  )
})

test('Blog without likes is 0', async () => {
  const newBlog = {
    title: 'Veamos',
    author: 'yo',
    url: 'https://reactpatterns.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  const likes = response.body.map(r => r.likes)
  expect(likes).toContain(
    0
  )
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'yo',
    url: 'https://reactpatterns.com/',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})


afterAll(() => {
  mongoose.connection.close()
})