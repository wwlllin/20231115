import 'dotenv/config' // 執行 dotenv 中的 config 檔
import linebot from 'linebot'
import fe from './commands/fe.js'
import be from './commands/be.js'
import anime from './commands/anime.js'
import { scheduleJob } from 'node-schedule'
import * as usdtwd from './data/usdtwd.js'

// https://crontab.guru/once-a-day
scheduleJob('0 0 * * *', () => {
	// ((每到0:00的時候執行一個function更新usdtwd))
	usdtwd.update()
})
usdtwd.update() // ((要再呼叫一次function，讓剛開啟node.js機器人時再跑一次這個function，不然會是30直到隔天))

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

/* ((
  bot.on('message', (event) => {}) 表當機器人收到訊息後執行的function。 event 包含訊息的資訊且有很多資訊可用，line機器人格式很多，現以文字舉例，可參考文件 https://www.npmjs.com/package/linebot#linebotoneventtype-eventhandler
  if (event.message.type === 'text') 表若訊息型態是文字的話才去做反應
  event.reply(event.message.text) 表傳什麼就回什麼，event.reply 可放陣列回傳多個訊息，至多5個，可參考文件 https://www.npmjs.com/package/linebot#eventreplymessage
  console.log(event) 表console.log收到的東西，用來debug
)) */
bot.on('message', (event) => {
	if (process.env.DEBUG === 'true') {
		console.log(event) // 可用來debug
	}
	if (event.message.type === 'text') {
		// 檢視收到的是否為文字
		if (event.message.text === '前端') {
			// 是文字且是前端
			fe(event)
		} else if (event.message.text === '後端') {
			be(event)
		} else if (event.message.text.startsWith('動畫')) {
			// ((若訊息開頭是動畫，就執行anime這個function))
			anime(event)
		} else if (event.message.text === '匯率') {
			event.reply(usdtwd.exrate.toString()) // (( usdtwd.exrate 型態是數字，但 event.reply() 只吃文字，所以要加 .toString() ))
		} else if (event.message.text === 'hi') {
			event.reply({
				type: 'text',
				text: '123',
				// ((quickReply:{}為快速回復的物件，items:[]放快速回復物件內有那些按鈕，按鈕的type都是'action'，action{}再分有哪些種類的按鈕))
				quickReply: {
					items: [
						{
							type: 'action',
							action: {
								// 傳訊息 ((使用者點擊按鈕會傳送訊息給機器人))
								type: 'message',
								// 傳送的文字 ((使用者點擊按鈕後會傳送給機器人的訊息))
								text: 'message text',
								// 按鈕的文字 ((按鈕顯示的文字))
								label: 'message'
							}
						},
						{
							type: 'action',
							action: {
								type: 'camera',
								label: '相機'
							}
						},
						{
							type: 'action',
							action: {
								type: 'cameraRoll', // ((cameraRoll相機膠捲，使用者點擊按鈕後會打開手機相簿))
								label: '相簿'
							}
						},
						{
							type: 'action',
							action: {
								type: 'location', // ((傳送位置訊息，使用者點擊按鈕後會打開line打卡功能))
								label: '位置'
							}
						},
						{
							type: 'action',
							action: {
								type: 'uri',
								uri: 'https://wdaweb.github.io', // ((uri參數用以設定網址))
								label: '網址'
							}
						},
						{
							type: 'action',
							action: {
								type: 'postback', // ((使用者點擊後在另一個事件處理使用者選擇到的東西，可以寫選擇題，data需是300字內的文字，參考文件 https://developers.line.biz/en/docs/messaging-api/actions/#postback-action))
								label: 'postback',
								// 傳送的文字 ((和message的text一樣，點擊按鈕後使用者會傳送的文字，但這文字不會被message事件接收到))
								// text: 'postback 文字',
								// postback 事件接收到的資料 ((點擊按鈕後機器人可在postback事件接收到的data))
								data: '123456789'
							}
						}
					]
				}
			})
		}
	}
})

// ((接收postback事件，點擊按鈕後機器人可在postback事件接收到data))
bot.on('postback', (event) => {
	console.log(event.postback.data)
})

bot.listen('/', process.env.PORT || 3000, () => {
	console.log('機器人啟動')
})

/* (( 按鈕補充
  Datetime picker action ，參考文件 https://developers.line.biz/en/reference/messaging-api/#datetime-picker-action
  若需使用者選擇日期，可用 quickReply 的 datetimepicker 可取得時間戳記，line 是用 Date.now()
  {
		type: 'action',
		action: {
			type: 'datetimepicker', // ((使用者點擊按鈕後會開啟日期選擇器))
			label: 'Select date',
			data: 'storeId=12345',
			mode: 'datetime', // ((可設定選擇器模式))
			initial: '2017-12-25t00:00', // ((可設定初始值))
			max: '2018-01-24t23:59', // ((可設定最大值))
			min: '2017-12-25t00:00' // ((可設定最小值))
			}
	}

  Rich menu switch action 圖文選單，參考文件 https://developers.line.biz/en/reference/messaging-api/#richmenu-switch-action
)) */
