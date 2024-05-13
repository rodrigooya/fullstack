import { useState } from 'react'

const BlogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => {
  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit} >
        <div>
            Title: <input id='title' value={title} onChange={handleTitleChange}/>
        </div>
        <div>
            Author: <input id='author' value={author} onChange={handleAuthorChange}/>
        </div>
        <div>
            Url: <input id='url' value={url} onChange={handleUrlChange}/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm