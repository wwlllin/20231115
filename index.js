import 'dotenv/config' // 執行 dotenv 中的 config 檔
import linebot from 'linebot'
import fe from './commands/fe.js'
import be from './commands/be.js'
import anime from './commands/anime.js'
import { scheduleJob } from 'node-schedule'
import * as usdtwd from './data/usdtwd.js'

// https://crontab.guru/once-a-day
scheduleJob('0 0 * * *', () => {
  usdtwd.update()
})
usdtwd.update()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', event => {
  if (process.env.DEBUG === 'true') {
    console.log(event) // 可用來debug
  }
  if (event.message.type === 'text') { // 檢視收到的是否為文字
    if (event.message.text === '前端') { // 是文字且是前端
      fe(event)
    } else if (event.message.text === '後端') {
      be(event)
    } else if (event.message.text.startsWith('動畫')) {
      anime(event)
    } else if (event.message.text === '匯率') {
      event.reply(usdtwd.exrate.toString())
    }
  }
})
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
