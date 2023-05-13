const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config()

const pageRouter = require("./routes/pages.routes.js");
const genreRouter = require("./routes/genres.routes.js");
const yearRouter = require("./routes/years.routes.js");
const searchRouter = require("./routes/search.routes.js");
const genreListRouter = require("./routes/genre-list.routes.js");

const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

app.use('/api/v1/page', pageRouter)
app.use('/api/v1/genre', genreRouter)
app.use('/api/v1/year', yearRouter)
app.use('/api/v1/search', searchRouter)
app.use('/api/v1/genre-list', genreListRouter)

app.get('/api/v1', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  
  res.redirect(url + 'page/1')
})

app.get('/', (req, res) => {
  res.status(200).json({
    message: "unofficial nanimex api"
  })
})

app.listen(port, () => console.log('server starting at', port))



