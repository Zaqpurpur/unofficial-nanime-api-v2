const express = require("express");
const axios = require("axios");
const memoryCache = require("memory-cache");

require("dotenv").config()

const { getAnimeList } = require("../utils/utils.js");

const router = express.Router()

router.get('/:year', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  
  res.redirect(url + '/page/1')
})

router.get('/:year/page/:page', async (req, res) => {
  try {
    const url = process.env.NANIME_URL
    const { year, page } = req.params
    const controller = new AbortController()
    let animeList;
    
    setInterval(() => {
      memoryCache.put(`year_${year}_page${page}`, null)
    }, 1000 * 60 * 3);
    
    if (memoryCache.get(`year_${year}_page${page}`) === null) {
      const { data } = await axios.get(url + 'year_/' + year + '/page/' + page || 1, {
        signal: controller.signal
      })
      animeList = getAnimeList(data)
      
      controller.abort()
      memoryCache.put(`year_${year}_page${page}`, animeList)
    }
    else {
      animeList = memoryCache.get(`year_${year}_page${page}`)
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