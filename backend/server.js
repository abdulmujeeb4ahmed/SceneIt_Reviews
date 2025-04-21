const express  = require('express')
const mongoose = require('mongoose')
const dotenv   = require('dotenv')
const cors     = require('cors')

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: false }))

const Movie = require('./models/Movie')
const { searchMovies, fetchMovieById } = require('./services/omdb')

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  }
}

app.use('/api/auth',    require('./routes/authRoutes'))
app.use('/api/reviews', require('./routes/reviewRoutes'))
app.use('/api/thumbs',  require('./routes/thumbRoutes'))

app.get('/api/omdb/search', async (req, res) => {
  const { title, page } = req.query
  if (!title) return res.status(400).json({ error: 'title query is required' })
  try {
    const results = await searchMovies(title, page)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/omdb/movie/:imdbID', async (req, res) => {
  try {
    const { imdbID } = req.params
    const cached = await Movie.findOne({ imdbID }).lean()
    if (cached) return res.json(cached)

    const movieData = await fetchMovieById(imdbID)
    res.json(movieData)

    Movie.findOneAndUpdate(
      { imdbID },
      { $set: movieData },
      { upsert: true }
    ).exec()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/', (req, res) => res.send('Server is running'))

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5001
    app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`))
  })
}

module.exports = app
