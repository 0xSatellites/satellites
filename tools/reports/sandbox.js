const axios = require('axios')


async function main(){
  const result = await axios.get('http://api.etherscan.io/api?module=account&action=txlist&address=0x2EDfeaC6A8c63A1CB4445E780C4e004b1e06466A&startblock=0&endblock=99999999&sort=asc&apikey=PFAVA4Q7J85X178D6GNAAH6XKU4Q3DNHF2')
  var match = 0
  var match_24h = 0
  var match_error_24 = 0
  var cancel = 0
  var cancel_24h = 0
  var cancel_error_24 = 0
  var value = 0
  var value_24h = 0

  var dt = new Date()
  dt.setHours(dt.getHours() - 24)
  var now = Math.round(dt.getTime() / 1000)

  for(var i=0; i<result.data.result.length; i++){
      if(result.data.result[i].to == "0x2edfeac6a8c63a1cb4445e780c4e004b1e06466a") {
        if(result.data.result[i].input.substring(0, 10) == "0xc709a742"){
            match++
            value = value + result.data.result[i].value/1000000000000000000
            if(result.data.result[i].timeStamp > now){
                match_24h++
                value_24h = value_24h + result.data.result[i].value/1000000000000000000
                if(result.data.result[i].isError==1){
                    match_error_24++
                }
            }
        } else if (result.data.result[i].input.substring(0, 10) == "0xa33b2d26") {
            cancel++
            if(result.data.result[i].timeStamp > now){
                cancel_24h++
                if (result.data.result[i].isError==1){
                    cancel_error_24++
                }
            }
        }
      }
  }

  var etherescan = "--- Checking Etherscan ---"
  etherescan = etherescan + '\n約定総数: ' + match
  etherescan = etherescan + '\nキャンセル総数: ' + cancel
  etherescan = etherescan + '\n流通総額: ' + value + 'ETH'
  etherescan = etherescan + '\n24h 約定数: ' + match_24h　
  etherescan = etherescan + '\n24h キャンセル数: ' + cancel_24h
  etherescan = etherescan + '\n24h 流通額: ' + value_24h + 'ETH'

  etherescan = etherescan + '\n24h 約定エラー: ' + match_error_24
  etherescan = etherescan + '\n24h キャンセルエラー: ' + cancel_error_24


}main()