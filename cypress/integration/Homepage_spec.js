describe('Homepage', () => { // update describe blocks
  it('Should have correct header and subheader', () => {
    cy
      .visit('http://localhost:3000')
      .get('header').contains('h1', 'RancidTomatillos')
      .get('header').contains('h2', 'Movie ratings and more.')
  })

  it('Should show movie data on page load', () => {
    cy
      .intercept('https://rancid-tomatillos.herokuapp.com/api/v2/movies', {fixture: 'mock-movie-data.json'})
      .visit('http://localhost:3000')
      .get('.poster-title').contains('Test 1')
      .get('.poster-img').should('have.attr', 'src').should('include', "https://image.tmdb.org/t/p/original//6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg")
      .get('.poster-rating').contains('6.7/10')
  })

  it('Should show an error message for a 500 server side error for all movies API', () => {
    cy
      .intercept({
        method: 'GET',
        url: 'https://rancid-tomatillos.herokuapp.com/api/v2/movies',
      },
      {
        statusCode: 500
      })
      .visit('http://localhost:3000')
      .get('.error-message').contains('h2', 'Unable to reach movie database.')
  })

  it.only('Should be able to click on a movie poster', () => { // NOT WORKING
    cy
      .intercept('https://rancid-tomatillos.herokuapp.com/api/v2/movies', {fixture: 'mock-movie-data.json'})
      .intercept('https://rancid-tomatillos.herokuapp.com/api/v2/movies/694919', {fixture: 'single-movie-data.json'})
      .visit('http://localhost:3000')
      .get('.poster:first').click()
      .url().should('include', '/movie/694919')
      .get('.movie-title').contains('Test 1')
  })

  it.skip('Should show an error message for an incorrect or nonexistent movie id', () => { // FIGURE OUT
    cy
      .intercept({
        method: 'GET',
        url: 'https://rancid-tomatillos.herokuapp.com/api/v2/movies/5',
      },
      {
        statusCode: 404
      })
      .visit('http://localhost:3000')
      .get('.error-message').contains('h2', 'Unable to reach movie database.') // what is the error message actually?
  })

  it('Should have a funtional back button from the movie details page', () => {
    cy
      .visit('http://localhost:3000/movie/694919')
      .get('.back-button').click()
      .get('header').contains('h2', 'Movie ratings and more.')
  })

})