// ((此檔案內容為如何回應前端這個指令。於此處理前端這個機器人指令的回覆，再於index.js執行引用&呼叫))
// ((拆分目的:若每個指令的處理邏輯都很長，又有多個指令的話，無像此拆分為多個小檔案，index.js檔裡的 bot.on('message', (event) => {}) function 裡會塞非常多東西，會很難管理，所以把每個指令額外拆出成一個檔案，再用 export 和 import 的方法去呼叫這些指令的function。用拆分方式讓 index.js 只留架構，其餘細的功能就在各自的 js 檔中))

import axios from 'axios'
import * as cheerio from 'cheerio' // cheerio功能為用JQ語法在node.js環境下解析HTML (( cheerio 的 import 語法是用具名匯出))

// ((一定是 async 因要用 axios 去抓資料))
// ((用 try catch))
export default async (event) => {
	try {
		const { data } = await axios.get('https://wdaweb.github.io/') // ((直接對http的網站發請求，此不是對json檔是直接對html檔案發請求)) ((可用postman看此網站拿到的html是什麼，有可能瀏覽器看到的跟postman得到的不一樣，即有時候瀏覽器看到的跟實際發請求得到的不一樣，因瀏覽器會去執行js，postman不會，會是原本html的樣子，axios拿到的東西是沒有執行js的，就是postman這些))
		const $ = cheerio.load(data) // ((文件規定寫法。用語法解析取得的html資料，在nodejs中沒有document.getElementByID等東西，需借助cheerio套件來讀取data(data為axios取到的html資料)))
		const replies = []
		$('#fe .card-title').each(function () {
			// ((針對找到的東西$('#fe .card-title')跑each迴圈))
			replies.push($(this).text().trim()) // ((此不能用event.reply($(this).text())寫法，因event.reply這個function只能呼叫一次，在這裡each迴圈會跑3次，使得event.reply會被執行3次會出錯，所以要把結果先借放在陣列內，即先開一個陣列const replies = []把東西push進去，最後再一起回復event.reply(replies)))((.trim()為拿掉前後空白))
		})
		event.reply(replies) // (( event.reply() 內可放陣列，一次回覆多個東西))
	} catch (error) {
		console.log(error)
	}
}
