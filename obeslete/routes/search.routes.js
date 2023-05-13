const express = require("express");
const axios = require("axios");
const memoryCache = require("memory-cache");

require("dotenv").config()

const { getAnimeList } = require("../utils/utils.js");

const router = express.Router()

router.get('/page/:page/', async (req, res) => {
  try {
    const url = process.env.NANIME_URL
    const { page } = req.params
    const search = req.query.search
    const controller = new AbortController()
    let animeList;
    
    setInterval(() => {
      memoryCache.put(`search_${search}_page${page}`, null)
    }, 1000 * 60 * 3);
    
    if (memoryCache.get(`search_${search}_page${page}`) === null) {
      const { data } = await axios.get(url + '/page/' + (page || 1) + '/?s=' + search, {
        signal: controller.signal
      })
      animeList = getAnimeList(data)
      
      controller.abort()
      memoryCache.put(`search_${search}_page${page}`, animeList)
    }
    else {
      animeList = memoryCache.get(`search_${search}_page${page}`)
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