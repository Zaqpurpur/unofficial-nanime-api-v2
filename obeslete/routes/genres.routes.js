const express = require("express");
const axios = require("axios");
const memoryCache = require("memory-cache");

require("dotenv").config()

const { getAnimeList } = require("../utils/utils.js");

const router = express.Router()

router.get('/:genre', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  
  res.redirect(url + '/page/1')
})

router.get('/:genre/page/:page', async (req, res) => {
  try {
    const url = process.env.NANIME_URL
    const { genre, page } = req.params
    const controller = new AbortController()
    let animeList;
    
    setInterval(() => {
      memoryCache.put(`genre_${genre}_page${page}`, null)
    }, 1000 * 60 * 3);
    
    if (memoryCache.get(`genre_${genre}_page${page}`) === null) {
      const { data } = await axios.get(url + 'genre/' + genre + '/page/' + page || 1, {
        signal: controller.signal
      })
      animeList = getAnimeList(data)
      
      controller.abort()
      memoryCache.put(`genre_${genre}_page${page}`, animeList)
      
    }
    else {
      animeList = memoryCache.get(`genre_${genre}_page${page}`)
    }
    
    res.status(200).json({
      page, animeList
    })
    
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router