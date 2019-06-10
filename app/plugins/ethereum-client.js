const Web3 = require('web3')
const config = require('../../functions/config.json')

const  web3 = new Web3(config.node[process.env.project].https)
const contract = {
  bazaaar: new web3.eth.Contract(
    config.abi.bazaaar,
    config.contract[process.env.project].bazaaar
  ),
  ck: new web3.eth.Contract(
    config.abi.ck,
    config.contract[process.env.project].ck
  ),
  ctn: new web3.eth.Contract(
    config.abi.ctn,
    config.contract[process.env.project].ctn
  ),
  ctn_distributer: config.contract[process.env.project].ctn_distributer,
  mchh: new web3.eth.Contract(
    config.abi.mchh,
    config.contract[process.env.project].mchh
  ),
  mche: new web3.eth.Contract(
    config.abi.mche,
    config.contract[process.env.project].mche
  ),
  mrm: new web3.eth.Contract(
    config.abi.mrm,
    config.contract[process.env.project].mrm
  )
}

const account = {
  address: null,
  balance: null
}

const activate = async provider => {
  try{
    web3.setProvider(provider)
    if(window.ethereum){
      await ethereum.enable()
    }
    const accounts = await web3.eth.getAccounts()
    if(accounts.length > 0) {
      account.address = accounts[0]
      account.balance = await web3.eth.getBalance(accounts[0])
      setInterval(async () => {
        web3.eth.getAccounts().then(accounts => {
          if (account.address != accounts[0]) {
            account.address = accounts[0]
            location.reload()
          }
        })
      }, 100)
    }
    return account
  } catch (err) {
    alert(err)
  }
}

const ownedTokens = async name => {
  const balance = await contract[name].methods.balanceOf(account.address).call()
  if (balance == 0) {
    return []
  }
  const promises = []
  for (var i = 0; i < balance; i++) {
    promises.push(contract[name].methods.tokenOfOwnerByIndex(account.address, i).call())
  }
  const result = await Promise.all(promises)
  return result
}

const signOrder = async order => {
  const data = web3.utils.soliditySha3(
    order.proxy,
    order.maker,
    order.taker,
    order.relayerRoyaltyRecipient,
    order.creatorRoyaltyRecipient,
    order.asset,
    order.id,
    order.price,
    order.nonce,
    order.salt,
    order.expiration,
    order.relayerRoyaltyRatio,
    order.creatorRoyaltyRatio,
    order.referralRatio,
  )
  const sig = await web3.eth.personal.sign(data, order.maker)

  order.r = sig.substring(0, 66)
  order.s = '0x' + sig.substring(66, 130)
  order.v = '0x' + sig.substring(130, 132)
  return order
}

const signUser = async() =>{
  const data = web3.utils.utf8ToHex("この署名を行うと、マイクリプトヒーローズ内で設定されているあなたの作成したアートエディットが、bazaaar内で表示されるようになります。またアセットの売買が発生した際に取引手数料の分配を受け取ることができます。")
  const signedUser = await web3.eth.personal.sign(data, account.address)
  return signedUser
}

const signUserForTwitter = async() =>{
  const data = web3.utils.utf8ToHex("この署名を行うと、あなたのTwitterアカウントがbazaaarに紐づけられます。")
  const signedUser = await web3.eth.personal.sign(data, account.address)
  return signedUser
}

const client = {
  account: account,
  activate: activate,
  contract: contract,
  ownedTokens: ownedTokens,
  signOrder:signOrder,
  utils: web3.utils,
  web3: web3,
  signUser: signUser,
  signUserForTwitter: signUserForTwitter
}

export default client
