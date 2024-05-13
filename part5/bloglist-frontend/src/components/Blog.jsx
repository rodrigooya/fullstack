import { useState } from 'react'

const Button = ({ onClick, text, id }) => <button id={id} onClick={onClick}>{text}</button>

const Blog = ({ blog, addLikes, removeBlog, user }) => {
  const [showAll, setShowAll] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const ButtonDelete = ({ blog }) => {
    if (blog.user.username === user.username) {
      return (
        <Button
          onClick={() => {
            removeBlog(blog.id)
          }}
          text="remove" />
      )
    }
  }

  const blogsToShow = showAll ? (
    ''
  ) : (
    <div>
      <p> {blog.url}</p>
      <p>
        {blog.likes} <Button
          id='like'
          onClick={() => {
            addLikes(blog.id)
          }}
          text="like" />
      </p>
      <p>{JSON.stringify(blog.user.name)}</p>
      <ButtonDelete blog={blog}/>
    </div>
  )

  return (
    <div style={blogStyle} className='blog'>
      <div className='blog' >
        {blog.title}
        {blog.author}
        <Button
          id="view"
          onClick={() => setShowAll(!showAll)}
          text={showAll ? 'view' : 'hide'}
        />
      </div>
      {blogsToShow}
    </div>
  )
}

export default Blog