import axios from 'axios'
import contract from '~/assets/js/contract';

const extensionURIPrefix = "https://www.mycryptoheroes.net/metadata/extension/"
const heroURIPrefix = "https://www.mycryptoheroes.net/metadata/hero/"

function hero(){

}

hero.bazaar = async function (data) {

    var param = {address:"0xB1A25D6E37ad12579801eBb6787636fd63ba87cc"}
    var balance = await contract.hero.methods.balanceOf(param.address).call()

    var tokenOfOwnerByIndexPromises = [];

    for (var i=0; i<balance; i++){
        tokenOfOwnerByIndexPromises.push(contract.hero.methods.tokenOfOwnerByIndex(param.address ,i).call())
    }

    var tokens = []

    await Promise.all(tokenOfOwnerByIndexPromises)
    .then(function (results) {
        tokens = results;
    });

    var tokenURIs = []

    for (var i=0; i<tokens.length; i++){
        var uri = heroURIPrefix + tokens[i]
        tokenURIs.push(uri)
    }

    var metadataPromises = [];    
    
    for (var i=0; i<tokenURIs.length; i++){
        metadataPromises.push(axios.get(tokenURIs[i]))
    }    

    var metadata = []
    
    console.log("go")
    await Promise.all(metadataPromises)
    .then(function (results) {
        for(var i=0; i<results.length; i++){
            metadata.push(results[i].data);
        }
    });        

    console.log(metadata)

}

function extension(){

}

export default {
    hero:hero,
    extension:extension
}