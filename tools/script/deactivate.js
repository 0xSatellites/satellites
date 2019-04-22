const config = require('./config.json')
const project = 'sand'

const admin = require('firebase-admin');
const serviceAccount = require('./.serviceAccountKey.json');

const Web3 = require('web3')
const web3 = new Web3(config.node[project].https)

const bazaaar_v1 = new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract[project].bazaaar_v1
)
const bazaaar_v2 = new web3.eth.Contract(
    config.abi.bazaaar_v2,
    config.contract[project].bazaaar_v2
)
const bazaaar_v3 = new web3.eth.Contract(
    config.abi.bazaaar_v3,
    config.contract[project].bazaaar_v3
)


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

var db = admin.firestore()
const batch = db.batch()
const now = new Date().getTime()

async function deactivate(){
    const snapshots = await db.collection('order').where('valid', '==', true).get()
    snapshots.forEach(doc => {
        const ref = db.collection('order').doc(doc.id)
        batch.update(ref, {
            result: { status: 'cancelled' },
            valid: false,
            modified: now
        })
    })
    batch.commit()
}

async function cleaning(){
    const snapshots = await db.collection('order').where('valid', '==', true).get()
    snapshots.forEach(async doc => {
        const ref = await db.collection('order').doc(doc.id).get()
        const order = ref.data()
        if(order.proxy == config.contract[project].bazaaar_v1) {
            const hash = await bazaaar_v1.methods
            .requireValidOrder_(
              [
                order.proxy,
                order.maker,
                order.taker,
                order.creatorRoyaltyRecipient,
                order.asset
              ],
              [
                order.id,
                order.price,
                order.nonce,
                order.salt,
                order.expiration,
                order.creatorRoyaltyRatio,
                order.referralRatio
              ],
              order.v,
              order.r,
              order.s
            )
            .call()
            if(hash != order.hash) {
                console.log(order.hash)
            }
        } else if (order.proxy == config.contract[project].bazaaar_v2) {
            const hash = await bazaaar_v2.methods
            .requireValidOrder_(
              [
                order.proxy,
                order.maker,
                order.taker,
                order.creatorRoyaltyRecipient,
                order.asset
              ],
              [
                order.id,
                order.price,
                order.nonce,
                order.salt,
                order.expiration,
                order.creatorRoyaltyRatio,
                order.referralRatio
              ],
              order.v,
              order.r,
              order.s
            )
            .call()
            if(hash != order.hash) {
                console.log(order.hash)
            }
        } else if (order.proxy == config.contract[project].bazaaar_v3) {
            const hash = await bazaaar_v3.methods
            .requireValidOrder_(
              [
                order.proxy,
                order.maker,
                order.taker,
                order.creatorRoyaltyRecipient,
                order.asset
              ],
              [
                order.id,
                order.price,
                order.nonce,
                order.salt,
                order.expiration,
                order.creatorRoyaltyRatio,
                order.referralRatio
              ],
              order.v,
              order.r,
              order.s
            )
            .call()
            if(hash != order.hash) {
                console.log(order.hash)
            }
        }

/*        


*/

        /*
        batch.update(ref, {
            result: { status: 'cancelled' },
            valid: false,
            modified: now
        })
        */
    })
    batch.commit()
}

cleaning()
//deactivate()
