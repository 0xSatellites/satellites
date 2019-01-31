const config = require('../../config.json')

const axios= require('axios');
const admin = require('firebase-admin');

const serviceAccount = require('../.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

//mchh()
//mche()

async function mche() {

    var limit = 300;
    var offset= 0;
    var processing = true;

    while (processing) {
        console.log("index: " + offset)
        var response = await axios({
            method:'get',
            url:'https://api.opensea.io/api/v1/events/?offset=' + offset + '&limit=300&only_opensea=true&event_type=successful&asset_contract_address=0xdceaf1652a131f32a821468dc03a92df0edd86ea',
            responseType:'json'
        })
        if(response.data.asset_events.length == 0){
            console.log("Finished.")
            processing = false;
            return
        }
        for(var i=0; i<response.data.asset_events.length; i++){
            if(response.data.asset_events[i].payment_token.symbol == "ETH"){
                try{
                    var order = {}
                    var id = response.data.asset_events[i].id;
                    order.market = "opensea"
                    order.asset = "mche"
                    order.asset_type = response.data.asset_events[i].asset.token_id.substring(0, response.data.asset_events[i].asset.token_id.length - 4)
                    order.asset_id = response.data.asset_events[i].asset.token_id;
                    order.price = response.data.asset_events[i].total_price;
                    order.timestamp = new Date(response.data.asset_events[i].event_timestamp).getTime()
                    order.status = "matched"
                    db.collection('order').doc(id.toString()).set(order);
                } catch (err){
                    console.log("error: ", offset, i)
                }
            }
        }
        if(response.data.asset_events.length < 300){
            console.log("Finished.")
            processing = false;
        }
        offset=offset+limit;
    }
}

async function mchh() {

    var limit = 300;
    var offset= 0;
    var processing = true;

    while (processing) {
        console.log("index: " + offset)
        var response = await axios({
            method:'get',
            url:'https://api.opensea.io/api/v1/events/?offset=' + offset + '&limit=300&only_opensea=true&event_type=successful&asset_contract_address=0x273f7f8e6489682df756151f5525576e322d51a3',
            responseType:'json'
        })
        if(response.data.asset_events.length == 0){
            console.log("Finished.")
            processing = false;
            return
        }
        for(var i=0; i<response.data.asset_events.length; i++){
            if(response.data.asset_events[i].payment_token.symbol == "ETH"){
                try{
                    var order = {}
                    var id = response.data.asset_events[i].id;
                    order.market = "opensea"
                    order.asset = "mchh"
                    order.asset_type = response.data.asset_events[i].asset.token_id.substring(0, response.data.asset_events[i].asset.token_id.length - 4)
                    order.asset_id = response.data.asset_events[i].asset.token_id;
                    order.price = response.data.asset_events[i].total_price;
                    order.timestamp = new Date(response.data.asset_events[i].event_timestamp).getTime()
                    order.status = "matched"
                    db.collection('order').doc(id.toString()).set(order);
                } catch (err){
                    console.log("error: ", offset, i)
                }
            }
        }
        if(response.data.asset_events.length < 300){
            console.log("Finished.")
            processing = false;
        }
        offset=offset+limit;
    }
}