import axios from 'axios'
import * as cheerio from 'cheerio'
import beTemplate from '../templates/be.js'

export default async (event) => {
	try {
		const { data } = await axios.get('https://wdaweb.github.io/')
		const $ = cheerio.load(data)
		const replies = []
		$('#be .card').each(function () {
			// (( img在cardheader內，card-title在cardbody內，所以跑迴圈要找cardheader和cardbody共通的，即為上一層的card))
			// 取出圖片和標題
			const image = $(this).find('img').attr('src') // ((image 是 $(this) 在這個卡片裡 .find('img') 找他的img的 .attr('src')))
			const imageUrl = new URL(image, 'https://wdaweb.github.io/') // ((在沒加這行之前，console.log(image)得到image是一個路徑，但line只吃http網址，需借助語法把路徑和網址合併在一起。new URL()為處理網址的工具物件，第一個參數放相對路徑，第二個參數放主網域網址，若單純文字連接還須自行判斷/問題，new URL()的好處是會協助判斷所以不用管有沒有./或/，參考影片02:42))
			const title = $(this).find('.card-title').text().trim() // ((title 是 $(this) 在這個卡片裡 .find('.card-title') 找他的card-title的 .text() 文字))
			// 產生一個新回應訊息模板 ((要寫在迴圈內 每次都是呼叫一個乾淨的新的模板))
			const template = beTemplate()
			// 修改模板內容
			template.hero.url = imageUrl
			template.body.contents[0].text = title
			replies.push(template)
		})
		/* ((
			看要怎麼去寫回應，line的flex訊息可以一個訊息回多個排成一排顯示的卡片。
			type: 'flex' -> 現在的replies陣列會是一堆type為'bubble'的物件，flex訊息若要送出去，外層要再包東西才行。因每張卡片的type為bubble(如templates/be.js所示)，但line不吃bubble這個訊息，所以不能直接type: 'bubble'給他，一定要在外層包一個type: 'flex'才行。
			altText: '後端課程' -> 一定要有 altText 預覽文字 (line在聊天室列表時會顯示的最後一個傳的訊息)
			type: 'carousel' -> 想做成多張bubble排在一起，需用type: 'carousel'把所有bubble排在一起
		)) */
		const result = await event.reply({
			type: 'flex',
			altText: '後端課程',
			contents: {
				// ((flex訊息的內容))
				type: 'carousel',
				contents: replies // ((contents才是bubble陣列-replies))
			}
		})
		console.log(result) // ((debug時可用，當linebot沒回應(即使用者端沒收到回覆，表在line驗證有錯誤沒過)，當傳訊息給但linebot時 console.log會在終端機顯示line的驗證，有錯誤會顯示message，沒錯誤會顯示sentMessages。**若要知道錯在哪，一定要在event.reply前加await去看其回應結果為何。))
	} catch (error) {
		console.log(error)
	}
}
