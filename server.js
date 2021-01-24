require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-small.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})


app.get('/movie', function handleGetMovie(req, res) {
  let response = MOVIES;
  console.log(response);

  /* When searching by name, users are searching for whether the Movie's name includes a specified string. The search should be case insensitive. */
  if (req.query.name) {
    response = response.filter(MOVIES =>
      // case insensitive searching
      MOVIES.film_title.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

   /* When searching by genre, users are searching for whether the Movie's genre includes a specified string. The search should be case insensitive. */
   if (req.query.genre) {
    response = response.filter(MOVIES =>
      // case insensitive searching
      MOVIES.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }



  /* When searching by country, users are searching for whether the Movie's country includes a specified string. The search should be case insensitive. */
  if (req.query.country) {
    response = response.filter(MOVIES =>
      // case insensitive searching
      MOVIES.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }

  /*  When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal to the supplied number. */
  if (req.query.avg_vote) {
    response = response.filter(MOVIES =>
      // case insensitive searching
      Number(MOVIES.avg_vote) >= Number(req.query.avg_vote)
    )
  }

  app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })


  res.json(response)
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})