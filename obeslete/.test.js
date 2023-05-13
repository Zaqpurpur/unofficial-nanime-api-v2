const { getAnimeList } = require("./utils/utils.js");

async function test() {
  const animeList = await getAnimeList("https://nanimex1.com/")
  console.log(animeList);
}
test()