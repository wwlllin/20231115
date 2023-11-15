import axios from 'axios'
import * as cheerio from 'cheerio' // 用JQ語法在node環境下解析HTML

export default async (event) => {
  try {
    const { data } = await axios.get('https://wdaweb.github.io/')
    const $ = cheerio.load(data)
    const replies = []
    $('#fe .card-title').each(function () {
      replies.push($(this).text().trim())
    })
    event.reply(replies)
  } catch (error) {
    console.log(error)
  }
}
