// ((可將網址先貼在postman上，看其資料是否直接寫在html上))
// ((記得檢查要用的 class 是否只有要的資料有))
// <div class="score-overall-number">5.0</div>
// <div class="data-file"> <img src alt

import axios from 'axios'
import * as cheerio from 'cheerio'
import animeTemplate from '../templates/anime.js'
import fs from 'node:fs' // ((檔案處理使用 File system，參考文件 https://nodejs.org/docs/latest/api/fs.html ，為 node.js 內建套件，無須另外安裝))

export default async (event) => {
	try {
		const id = event.message.text.replace('動畫', '') // ((前面的動畫取代成空的))
		const { data } = await axios.get(`https://ani.gamer.com.tw/animeVideo.php?sn=${id}`)
		const $ = cheerio.load(data)

		const template = animeTemplate()

		// 背景圖
		template.body.contents[0].url = $('.data-file img').attr('data-src') // ((瀏覽器上有src 但postman請求到的只有data-src 要用data-src))
		// 動畫名稱
		template.body.contents[2].contents[0].contents[0].contents[0].text = $('.data-file img').attr('alt')

		// 星星
		// (( const totalStar = Math.round(parseFloat($('.score-overall-number').text())) 因分數部分也需要用到score，故可拆成下列寫法以重複利用變數))
		const score = $('.score-overall-number').text() // ((取得星星數的文字))
		const totalStar = Math.round(parseFloat(score)) // ((parseInt會無條件捨去，要parseFloat把文字轉為小數，再 Math.round四捨五入))
		// ((金星星 url直接用line的))
		for (let i = 0; i < totalStar; i++) {
			template.body.contents[2].contents[0].contents[1].contents[i].url =
				'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
		}
		// ((灰星星 url直接用line的))
		for (let i = totalStar; i < 5; i++) {
			template.body.contents[2].contents[0].contents[1].contents[i].url =
				'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
		}
		// 分數
		template.body.contents[2].contents[0].contents[1].contents[5].text = score
		// 評分人數
		template.body.contents[2].contents[0].contents[2].contents[0].contents[0].text = $('.score-overall-people').text()

		// ((原傳訊息會寫檔案下來，但之後部屬到雲端server寫檔案這個動作沒有意義，因雲端平台是無法直接看到在server的檔案，故可加協助debug的指令，詳情請參考20231115影片04:43:30))
		if (process.env.DEBUG === true) {
			fs.writeFileSync('./dump/anime.json', JSON.stringify(template, null, 2))
		}
		/*((
        把template用JSON.stringify()轉成文字，加上 null, 2 兩個空白的縮排，寫進./dump/anime.json
        ** 必須先建立好資料夾dump否則會掛掉，建立資料夾可用 fs.mkdirSync 或直接建
        完成上述設定後再下一次指令便於指定路徑產出指定檔案
        將產出的json檔全選複製貼到 line flex message 模擬器的 View as JSON 裡，
        line flex message 模擬器的 View as JSON 除了可匯出模板寫的東西外，亦可貼上自己的套用，會告訴你哪裡錯
        若除錯完還是沒反應可能是 nodemon 在 fs.writeFileSync 寫新檔案時偵測到變更，沒跑到下方 result，若要 nodemon 忽略特定的檔案或資料夾有3種方法，詳情請參考20231115影片04:04:--)
    ))*/

		const result = await event.reply({
			type: 'flex',
			altText: '查詢結果',
			contents: template // ((若只有一顆，不需包成 type: 'carousel' ，直接bubble拿來用即可))
		})
		console.log(result)
	} catch (error) {
		console.log(error)
	}
}
