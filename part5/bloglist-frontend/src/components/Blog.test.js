import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(/React patterns/)
  expect(element).toBeInTheDocument()
})

test('clicking the button calls event handler once', async () => {
  const blog = {
    url: 'https://reactpatterns.com/',
    likes: 5,
    user:'Matti Luukkainen'
  }
  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} setShowAll={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText(/view/)
  await user.click(button)
  const element = screen.getByText('https://reactpatterns.com/')
  expect(element).toBeInTheDocument()
})