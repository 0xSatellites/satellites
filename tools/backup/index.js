const functions = require('firebase-functions');
const {
  google
} = require('googleapis');
const rp = require('request-promise');
const projectId = process.env.GCLOUD_PROJECT; // 関数が属しているGCPプロジェクトIDが環境変数に登録されている

async function exportFirestore() {
  try {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/datastore']
    });

    const accessTokenResponse = await auth.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const endpoint = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`;
    const option = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      json: true,
      body: {
        outputUriPrefix: `gs://${projectId}-firestore-backup`,
      }
    };
    const res = await rp.post(endpoint, option);
    return res;
  } catch (err) {
    console.log(`error occurred when doing backup: ${err}`);
    return err;
  }
}
exports.FirestoreBackup = functions.pubsub
  .topic('FirestoreBackup')
  .onPublish(async (msg) => {
    try {
      const res = await exportFirestore();
      console.log(`firestore backup job is successfully registered: ${res}`);
      return res;
    } catch (err) {
      console.log(`error occurred when backuping: ${err}`);
    }
  });
