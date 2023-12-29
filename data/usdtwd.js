// ((開usdtwd.js檔案來存美元轉台幣的匯率資料))

import axios from 'axios'

// ((先定義預設值是30，此用具名匯出))
export let exrate = 30

// ((定義一個更新的function，會去串API然後更新exrate數字))
export const update = async () => {
	try {
		const { data } = await axios.get('https://tw.rter.info/capi.php')
		exrate = data.USDTWD.Exrate
	} catch (error) {
		console.log(error)
	}
}
