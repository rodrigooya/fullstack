const _ = require('lodash')

const dummy = (blogs) => {
  return blogs.length === 0
    ? 1
    : 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum,blogs) => blogs.likes + sum, 0)
}

const favoriteBlog = (blogs) => {
  const favorito = _.maxBy(blogs, 'likes')
  return {
    author: favorito.author,
    title: favorito.title,
    likes: favorito.likes
  }
}

const mostBlogs = (blogs) => {
  const y = _.countBy(blogs, 'author')
  var maxed = _.chain(y).
    map(function(cnt, author){
      return {
        author: author,
        blogs: cnt
      }
    }).maxBy('blogs')
    .value()
  return (maxed)
}

const mostLikes = (blogs) => {
  const y = _.groupBy(blogs, 'author')
  var maxed = _.chain(y).
    map(function(blog, author){
      return {
        author: author,
        likes: _.sumBy(blog,'likes')
      }
    }).maxBy('likes')
    .value()
  return (maxed)
}



module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}