exports.myitems = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
    res.set('Cache-Control', 'public, max-age=100, s-maxage=300')
  
    let query = req.query
  
    let balancePromises = []
    balancePromises.push(mchhContract.methods.balanceOf(query.owner).call())
    balancePromises.push(mcheContract.methods.balanceOf(query.owner).call())
  
    let balances = await Promise.all(balancePromises)
  
    let mchhTokenOfOwnerByIndexPromises = [];
    let mcheTokenOfOwnerByIndexPromises = [];
  
    for (var i=0; i<balances[0]; i++){
      mchhTokenOfOwnerByIndexPromises.push(mchhContract.methods.tokenOfOwnerByIndex(query.owner ,i).call())
    }
  
    for (var i=0; i<balances[1]; i++){
      mcheTokenOfOwnerByIndexPromises.push(mcheContract.methods.tokenOfOwnerByIndex(query.owner ,i).call())
    }
  
    let tokenOfOwnerByIndexPromises = [
      mchhTokenOfOwnerByIndexPromises,
      mcheTokenOfOwnerByIndexPromises
    ]
  
    let tokens = await Promise.all(
      tokenOfOwnerByIndexPromises.map(function(innerPromise) {
           return Promise.all(innerPromise);
      })
    )
  
    console.log("tokens " + tokens)
    let mchhGeneralPromises = [];
    let mcheGeneralPromises = [];
  
    for (var token in tokens[0]) {
      mchhGeneralPromises.push(axios({
        method:'get',
        url:config.api.mch.metadata + 'hero/' + token,
        responseType:'json'
      }))
    }
  
    for (var token in tokens[1]) {
      mcheGeneralPromises.push(axios({
        method:'get',
        url:config.api.mch.metadata + 'hero/' + token,
        responseType:'json'
      }))
    }
  
    GeneralPromises = [
      mchhGeneralPromises,
      mcheGeneralPromises
    ]
  
    let generals = await Promise.all(
      GeneralPromises.map(function(innerGeneralPromise) {
           return Promise.all(innerGeneralPromise);
      })
    )
  
    console.log("generals " + tokens)
    let mchhExtraPromises = [];
    let mcheExtralPromises = [];
  
    for (var general in generals[0]) {
  
      mchhExtraInnerPromises = []
      mchhExtraInnerPromises.push(axios({
        method:'get',
        url:config.api.mch.metadata + 'heroType/'+ general.data.extra_data.hero_type,
        responseType:'json'
      }))
  
      mchhExtraInnerPromises.push(axios({
        method:'get',
        url:config.api.mch.metadata + 'skill/' + general.data.extra_data.active_skill_id,
        responseType:'json'
      }))
  
      mchhExtraInnerPromises.push(axios({
        method:'get',
        url:config.api.mch.metadata + 'skill/' + general.data.extra_data.passive_skill_id,
        responseType:'json'
      }))
  
      mchhExtraPromises.push(mchhExtraInnerPromises)
    }
  
    for (var general in generals[1]) {
  
      mcheExtraInnerPromises = []
      mcheExtraInnerPromises.push(axios({
        method:'get',
        url:config.api.mch.metadata + 'extensionType/'+ general.data.extra_data.extension_type,
        responseType:'json'
      }))
  
      mcheExtraInnerPromises.push(axios({
        method:'get',
        url:config.api.mch.metadata + 'skill/' + general.data.extra_data.skill_id,
        responseType:'json'
      }))
  
      mcheExtralPromises.push(mcheExtraInnerPromises)
    }
  
    extraPromises = [
      mchhExtraPromises,
      mcheExtraPromises
    ]
  
    let resolved = await Promise.all(
      extraPromises.map(function(innerExtraPromise) {
        innerExtraPromise.map(function(innerInnerExtraPromise) {
          return Promise.all(innerInnerExtraPromise)
        })
      })
    )
  
  
    console.log(generals)
    console.log(resolved)
    res.status(200).send(response)
  
  })