const express = require("express");
const axios = require("axios");
const memoryCache = require("memory-cache");

require("dotenv").config()

const { getAnimeList } = require("../utils/utils.js");

const router = express.Router()

router.get('/', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  
  res.redirect(url + '/1')
})

router.get('/:page', async (req, res) => {
  try {
    const url = process.env.NANIME_URL
    const page = req.params.page || 1
    const controller = new AbortController()
    let animeList;
    
    setInterval(() => {
      memoryCache.put(`page${page}`, null)
    }, 1000 * 60 * 3);
    
    if (memoryCache.get(`page${page}`) === null) {
      const { data } = await axios.get(url + 'page/' + page, {
        signal: controller.signal
      })
      animeList = getAnimeList(data)
      
      controller.abort()
      memoryCache.put(`page${page}`, animeList)
    }
    else {
      animeList = memoryCache.get(`page${page}`)
    }
    res.status(200).json({
      page, animeList
    })
    
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router