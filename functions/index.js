const functions = require('firebase-functions');
const axios = require('axios')
const opensea = 'https://api.opensea.io/api/v1/assets?limit=300'

exports.getAssetsByAssetAddressesTokenIds = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200')

    let requestURL = opensea
    const result = {}
    const assets = []
    const promises = []
    if(Array.isArray(req.query.asset_contract_addresses)){
        for(const address of req.query.asset_contract_addresses) {
            requestURL = `${requestURL}&asset_contract_address=${address}`
            if(Array.isArray(req.query.token_ids)){
                for(const tokenId of req.query.token_ids) {
                    requestURL = `${requestURL}&token_ids=${tokenId}`
                }
            } else {
                requestURL = `${requestURL}&token_ids=${req.query.token_ids}`
            }
            promises.push(axios.get(requestURL))
        }
    } else {
        requestURL = `${requestURL}&asset_contract_address=${req.query.asset_contract_addresses}`
        if(Array.isArray(req.query.token_ids)){
            for(const tokenId of req.query.token_ids) {
                requestURL = `${requestURL}&token_ids=${tokenId}`
            }
        } else {
            requestURL = `${requestURL}&token_ids=${req.query.token_ids}`
        }
        promises.push(axios.get(requestURL))
    }

    const resolves = await Promise.all(promises)
    for (const resolve of resolves) {
        for(const asset of resolve.data.assets){
            assets.push(asset)
        }
    }
    result.assets = assets
    res.json(result)
})

exports.getAssetByAssetAddresseTokenId = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
    res.set('Cache-Control', 'public, max-age=150, s-maxage=300')

    let requestURL = opensea
    requestURL = `${requestURL}&asset_contract_address=${req.query.asset_contract_address}`
    requestURL = `${requestURL}&token_ids=${req.query.token_ids}`
    const response = await axios.get(requestURL)
    const result = {}
    result.assets = response.data.assets
    res.json(result)
})

exports.getAssetsByOwnerAddress = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
    res.set('Cache-Control', 'public, max-age=150, s-maxage=300')

    let requestURL = opensea
    requestURL = `${requestURL}&owner=${req.query.owner}`
    if(Array.isArray(req.query.asset_contract_addresses)){
        for(const tokenId of req.query.asset_contract_addresses) {
            requestURL = `${requestURL}&asset_contract_addresses=${tokenId}`
        }
    } else {
        requestURL = `${requestURL}&asset_contract_addresses=${req.query.asset_contract_addresses}`
    }
    const response = await axios.get(requestURL)
    const result = {}
    result.assets = response.data.assets
    res.json(result)
})
