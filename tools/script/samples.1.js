const axios = require('axios')
const contractAddress = ""
const api = ""
const method = "" //0xc709a742

async function report(){
  var count = 0
  var count_24h = 0
  var value = 0
  var value_24h = 0
  var error_24h = 0
  const result = await axios.get('https://api.etherscan.io/api?module=account&action=txlist&address=' + contractAddress + '&startblock=0&endblock=99999999&sort=asc&apikey=' + api)
  var dt = new Date()
  dt.setHours(dt.getHours() - 24)
  var now = Math.round(dt.getTime() / 1000)

  for(var i=0; i<result.data.result.length; i++){
      if(result.data.result[i].to == contractAddress) {
        if(result.data.result[i].input.substring(0, 10) == method){
            count++
            value = value + result.data.result[i].value/1000000000000000000
            if(result.data.result[i].timeStamp > now){
                count_24h++
                value_24h = value_24h + result.data.result[i].value/1000000000000000000
                if(result.data.result[i].isError==1){
                  error_24h++
                }
            }
        }
      }
  }
}