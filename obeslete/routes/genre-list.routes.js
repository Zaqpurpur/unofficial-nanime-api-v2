const express = require("express");
const { getGenreList } = require("../utils/utils.js")

const router = express.Router()

router.get('/', (req, res) => {
  const genreList = getGenreList()
  
  res.status(200).json({
    genreList
  })
})

module.exports = router
