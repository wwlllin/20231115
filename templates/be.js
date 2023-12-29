// (( FLEX MESSAGE SIMULATOR ))
// (( export default{} 內貼的是 line flex message 的JSON檔))
// (( 因貼的是JSON，但此檔名是.js，所以需要 export default{} ，把其變成js檔裡的一個變數。若無 export default{} 直接貼上 JSON 會是在js檔中寫JSON檔案的東西，兩者不同，且直接貼上存檔沒有用，因整個檔案都錯了))
// (( 改變數還有一個問題，若改的是陣列或物件的話會把來源檔案的值一起改掉。export default{} 只有在第一次引用時會被執行，所以就固定是這個物件。為避免東西被改掉，需稍微改寫，不能直接 export default{} 這樣改到的會是同一個東西，所以要把變數改成一個function，function再去return物件，這樣每呼叫一次function就會return一個新的物件，可避免模板間相互影響))
export default () => {
	return {
		type: 'bubble',
		hero: {
			type: 'image',
			url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
			size: 'full',
			aspectRatio: '20:13',
			aspectMode: 'cover'
			// action: {
			// 	type: 'uri',
			// 	uri: 'http://linecorp.com/'
			// }
			// ((action可以拿掉，是指點下去要幹嘛，uri代表圖片點下去會打開line的官網，這邊用不到可刪))
		},
		body: {
			type: 'box',
			layout: 'vertical',
			contents: [
				{
					type: 'text',
					text: 'Brown Cafe',
					weight: 'bold',
					size: 'xl'
				}
			]
		}
	}
}
