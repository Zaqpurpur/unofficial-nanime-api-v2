const cheerio = require("cheerio");

function getVideoUrl(data) {
  const $ = cheerio.load(data)
  const findParent = $(".box-body .episode_list")
  let videoUrl;
  
  findParent.each((idx, item) => {
    videoUrl = $(item).find('a').attr('href')
  })
  return videoUrl + 'embed/'
}

function getAnimeList(data) {
  const $ = cheerio.load(data)
  const content = $('.content')
  const animeList = $(content).find('.box-poster')
  
  const arrayAnimeList = []
  
  $(animeList).find('.content-item').each((idx, contentItem) => {
    const title = $(contentItem).find('h3.post-title').attr('title')
    const poster = {
        imageUrl: $(contentItem).find('.poster > img').attr('data-lazy-src'),
        imageAlt: $(contentItem).find('img').attr('alt')
      }
    const path = new URL($(contentItem).find('a').attr("href")).pathname
    const rating = parseFloat($(contentItem).find('.episode').find('.label.btn-warning').text().replace('\s', ''))
    const totalEpisode = parseInt($(contentItem).find('.episode').find('.label.btn-danger').text().replace('Episode ', ''))
    const status = $(contentItem).find('.status').text().split('  ')[1]
    const releaseYear = parseInt($(contentItem).find('.status').text().split('  ')[0])

    arrayAnimeList.push({
      title, poster, path, rating, totalEpisode, status, releaseYear
    })
  })
  
  return arrayAnimeList
}

function getGenreList() {
  return [
    "action", "adventure", "animation", "award-winning",
    "comedy", "crime", "demons", "donghua",
    "drama", "ecchi", "family", "fantasy",
    "game", "girls-love", "harem", "historical",
    "horror", "josei", "kids", "live-actio n",
    "magic", "martial-arts", "mecha", "military",
    "music", "mistery", "parody", "police",
    "psychological", "romance", "samurai", "school",
    "sci-fi", "seinen", "shoujo", "shoujo-ai",
    "shounen", "slice-of-life", "space", "sports",
    "supernatural", "superpower", "suspense", "thriller",
    "vampire"
    ]
}

module.exports = {
  getVideoUrl,
  getAnimeList,
  getGenreList
}

