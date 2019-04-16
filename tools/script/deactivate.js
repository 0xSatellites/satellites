const admin = require('firebase-admin');
const serviceAccount = require('./.serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

var db = admin.firestore()
const batch = db.batch()
const now = new Date().getTime()

async function main(){
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
}main()
