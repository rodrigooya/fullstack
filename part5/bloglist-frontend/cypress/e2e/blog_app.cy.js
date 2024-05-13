describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('blogs')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })
    it('login fails with wrong password', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  //describe('When logged in', function() {
  //beforeEach(function() {
  //cy.login({ username: 'mluukkai', password: 'salainen' })
  //cy.createBlog({ title: 'first blog', author: 'rodrigo', url: 'www.rodrigo.com' })
  //})

  //it('A blog can be created', function() {
  //cy.contains('new blog').click()
  //cy.get('#title').type('a blog created by cypress')
  //cy.get('#author').type('rodrigo')
  //cy.get('#url').type('www.rodrigo.com')
  //cy.contains('create').click()
  //cy.contains('a blog created by cypress')
  //})
  //})

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({ title: 'first blog', author: 'rodrigo', url: 'www.rodrigo.com' })
      cy.createBlog({ title: 'second blog', author: 'rodrigo', url: 'www.rodrigo.com' })
      cy.createBlog({ title: 'third blog', author: 'rodrigo', url: 'www.rodrigo.com' })
    })

    it('A blog can view', function() {
      cy.contains('second blog')
      cy.contains('view').click()

      cy.contains('like').click()
      cy.contains('1')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by deleted')
      cy.get('#author').type('rodrigo')
      cy.get('#url').type('www.rodrigo.com')
      cy.contains('create').click()
      cy.contains('a blog created by deleted')
      cy.contains('view').click()
      cy.contains('remove').click()
    })
  })
})
