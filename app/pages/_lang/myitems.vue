<template>
  <div>
    <section class="l-personal" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('myitems.mypage') }}</h2>
      <div class="l-personal__frame">
        <dl class="l-personal__address">
          <dt>{{ $t('myitems.address') }}：</dt>
          <dd>{{ account.address }}</dd>
        </dl>
        <dl class="l-personal__balance">
          <dt>{{ $t('myitems.balance') }}：</dt>
          <dd>{{ Math.round((account.balance / 1000000000000000000) * 10000) / 10000 }} ETH</dd>
        </dl>
      </div>
      <div class="l-personal__frame">
        <v-flex xs12 px-3>
          <h4>{{ $t('myitems.experiment') }}</h4>
          {{ $t('myitems.mch_artedit') }}
           <v-switch v-model="switch1" :label="`${switch1.toString()}`" @change="permitArtedit()" color="primary"></v-switch>
        </v-flex>

        <div v-if="!isLogin">
                <v-btn @click=twitterLogin>Twitterログイン</v-btn>
                </div>
                <div v-else-if="!isSigned">
                  <div class="l-item__txt">
                      {{ $t('myitems.needSign')}}
                  </div>
                </div>
                <div v-else>
                <p>{{ twitterAccount.displayName }}</p>
                <v-list-tile-avatar class="news__item__avatar">
                        <img :src="twitterAccount.photoURL">
                    </v-list-tile-avatar>
                <v-btn @click=twitterLogout>ログアウト</v-btn>
        </div>

      </div>
    </section>
    <section class="l-personal" v-else>
      <h2 class="l-personal__title">Get <a href="https://metamask.io/" target="_blank">metamask</a> or</h2>
      <h2 class="l-personal__title">Get <a href="https://tokenpocket.github.io/applink?dappUrl=https://bazaaar.io/" target="_blank">TokenPocket</a> or</h2>
      <h2 class="l-personal__title">Get <a href="https://www.go-wallet.app/" target="_blank">GO!WALLET</a> and login</h2>
    </section>
    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('asset.mchh') }}</h2>
      <ul>
        <v-progress-circular class="l-personal__loading" v-if="this.loadingMCHH || this.loadingMCHE" :size="50" color="blue" indeterminate></v-progress-circular>
        <li v-for="(mchh, i) in this.heroes" :key="i + '-mchh'" v-else-if="this.heroes.length">
          <div>
            <nuxt-link :to="'/' + lang + '/mchh/' + mchh.attributes.id" class="c-card">
              <div class="c-card__label--exhibit" v-if="selling.includes(mchh.attributes.id.toString())">{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="i in getRarity(mchh, 'mchh')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img class="pa-4" :src="mchh.image_url" /></div>
              <div class="c-card__name" v-if="mchh.hero_type.name[lang]">{{ mchh.hero_type.name[lang].substring(0, 25) }} / Lv: {{ mchh.attributes.lv }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ mchh.attributes.id }}</div>
            </nuxt-link>
          </div>
        </li>
        <v-flex xs12 sm6 offset-sm3 v-if="!this.extensions.length && !this.heroes.length && !this.loadingMCHH && !this.loadingMCHE">
          <a href="https://www.mycryptoheroes.net">
            <v-card>
              <v-img v-bind:src="require('~/assets/img/asset/MyCryptoHeros.png')" aspect-ratio="1.75" contain></v-img>
              <v-card-title primary-title>
                <v-layout justify-center>
                  <h3 class="headline mb-0">{{ $t('empty.mch') }}</h3>
                </v-layout>
              </v-card-title>
            </v-card>
          </a>
        </v-flex>
      </ul>
    </section>
    <section class="c-index c-index--mypage" v-if="account.address">
      <ul v-if="this.extensions.length">
        <li v-for="(mche, i) in this.extensions" :key="i + '-mche'">
          <div>
            <nuxt-link :to="'/' + lang + '/mche/' + mche.attributes.id" class="c-card">
              <div class="c-card__label--exhibit" v-if="selling.includes(mche.attributes.id.toString())">{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="i in getRarity(mche, 'mche')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img class="pa-4" :src="mche.image_url" /></div>
              <div class="c-card__name" v-if="mche.extension_type.name[lang]">{{ mche.extension_type.name[lang].substring(0, 25) }} / Lv: {{ mche.attributes.lv }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ mche.attributes.id }}</div>
            </nuxt-link>
          </div>
        </li>
      </ul>
    </section>

    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('asset.ctn') }}</h2>
      <ul>
        <v-progress-circular class="l-personal__loading" v-if="this.loadingCTN" :size="50" color="blue" indeterminate></v-progress-circular>
        <li v-for="(ctn, i) in this.oinks" :key="i + '-ctn'" v-else-if="this.oinks.length">
          <div>
            <nuxt-link :to="'/' + lang + '/ctn/' + ctn.id" class="c-card">
              <div class="c-card__label--exhibit" v-if="selling.includes(ctn.id.toString())">{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="i in getRarity(ctn, 'ctn')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="ctn.image" /></div>
              <div class="c-card__name" v-if="ctn.name">{{ ctn.name.substring(0, 25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ ctn.id }}</div>
              <div class="c-card__txt">Gen {{ ctn.generation }} : {{ coolDownIndexToSpeed(3) }}</div>
            </nuxt-link>
          </div>
        </li>
      </ul>
      <v-flex xs12 sm6 offset-sm3 v-if="!this.oinks.length && !this.loadingCTN">
        <a href="https://www.crypt-oink.io" target="_blank">
          <v-card>
            <v-img v-bind:src="require('~/assets/img/asset/Crypt_Oink.png')" aspect-ratio="1.75"></v-img>
            <v-card-title primary-title>
              <v-layout justify-center>
                <h3 class="headline mb-0">{{ $t('empty.oink') }}</h3>
              </v-layout>
            </v-card-title>
          </v-card>
        </a>
      </v-flex>
    </section>

    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('asset.ck') }}</h2>
      <ul>
        <v-progress-circular class="l-personal__loading" v-if="this.loadingCK" :size="50" color="blue" indeterminate></v-progress-circular>
        <li v-for="(ck, i) in this.kitties" :key="i + '-ck'" v-else-if="this.kitties.length">
          <div>
            <nuxt-link :to="'/' + lang + '/ck/' + ck.id" class="c-card">
              <div class="c-card__label--exhibit" v-if="selling.includes(ck.id.toString())">{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="i in getRarity(ck, 'ck')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="ck.image_url" /></div>
              <div class="c-card__name" v-if="ck.name">{{ ck.name.substring(0, 25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ ck.id }}</div>
              <div class="c-card__txt">Gen {{ ck.generation }} : {{ coolDownIndexToSpeed(ck.status.cooldown_index) }}</div>
            </nuxt-link>
          </div>
        </li>
      </ul>
      <v-flex xs12 sm6 offset-sm3 v-if="!this.kitties.length && !this.loadingCK">
        <a href="https://www.cryptokitties.co/" target="_blank">
          <v-card>
            <v-img v-bind:src="require('~/assets/img/asset/CryptoKitties.png')" aspect-ratio="1.75"></v-img>
            <v-card-title primary-title>
              <v-layout justify-center>
                <h3 class="headline mb-0">{{ $t('empty.kitty') }}</h3>
              </v-layout>
            </v-card-title>
          </v-card>
        </a>
      </v-flex>
    </section>

    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('asset.mrm') }}</h2>
      <ul>
        <v-progress-circular class="l-personal__loading" v-if="this.loadingMRM" :size="50" color="blue" indeterminate></v-progress-circular>
        <li v-for="(mrm, i) in this.records" :key="i + '-mrm'" v-else-if="this.records.length">
          <div>
            <nuxt-link :to="'/' + lang + '/mrm/' + mrm.attributes.id" class="c-card">
              <div class="c-card__label--exhibit" v-if="selling.includes(mrm.attributes.id.toString())">{{ $t('myitems.sell') }}</div>
              <div class="c-card__img"><img :src="mrm.image_url" /></div>
              <div class="c-card__name" v-if="mrm.name">{{ mrm.name.substring(0, 25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ mrm.attributes.id }}</div>
            </nuxt-link>
          </div>
        </li>
      </ul>
      <v-flex xs12 sm6 offset-sm3 v-if="!this.records.length && !this.loadingMRM">
        <a href="http://maltinerecords.cs8.biz/b1.html" target="_blank">
          <v-card>
            <v-img v-bind:src="require('~/assets/img/maltine/maltinelogo.png')" aspect-ratio="1.75"></v-img>
            <v-card-title primary-title>
              <v-layout justify-center>
                <h3 class="headline mb-0">{{ $t('empty.mrm') }}</h3>
              </v-layout>
            </v-card-title>
          </v-card>
        </a>
      </v-flex>
    </section>

    <!-- 履歴 -->
    <section class="c-index c-index--mypage" v-if="this.transactions.length">
      <v-data-table :headers="headers" :items="this.transactions" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ timeConverter(props.item.modified) }}</td>
          <td v-if="props.item.maker == account.address">sold</td>
          <td v-else>purchased</td>
          <td>{{ toAsset(props.item.asset) }}</td>
          <td>{{ props.item.id }}</td>
          <td>{{ fromWei(props.item.price) }} ETH</td>
        </template>
      </v-data-table>
    </section>
  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import lib from '~/plugins/lib'
import api from '~/plugins/api'
import axios from 'axios'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'
import firebase from 'firebase'

const config = require('../../../functions/config.json')
const project = process.env.project

export default {
  
  data() {
    return {
      headers: [{ text: 'date', value: 'date' }, { text: 'result', value: 'result' }, { text: 'asset', value: 'asset' }, { text: 'id', value: 'id' }, { text: 'price', value: 'price' }],
      loadingCK: true,
      loadingCTN: true,
      loadingMCHH: true,
      loadingMCHE: true,
      loadingMRM: true,
      switch1: false,
      isLogin: false,
      isSigned: false,
      twitterAccount: [],
      kitties: [],
      oinks: [],
      heroes: [],
      extensions: [],
      records: [],
      transactions: [],
      order: [],
      user: [],
    }
  },
  watch: {
    isLogin: function(val){
      if(val){
      this.twitterDataPass()
      }
    }
  },
  mounted: async function() {
    const order = this.order
    const store = this.$store
    var account

    firebase.auth().onAuthStateChanged(twitterAccount =>{
      if (twitterAccount) {
        this.isLogin = true
        this.twitterAccount = twitterAccount
        
      } else {
        console.log("logout")
        this.isLogin = false
        this.twitterAccount = []
      };
    })

    if (typeof web3 != 'undefined' || window.ethereum) {
      if (!client.account.address) {
        if (window.ethereum) {
          account = await client.activate(ethereum)
        } else {
          account = await client.activate(web3.currentProvider)
        }
        store.dispatch('account/setAccount', account)
      }
      
      api.getKittiesByWalletAddress(client.account.address).then(async tokens => {
        this.kitties = tokens
        this.loadingCK = false
      })

      api.getOinkIdsByWalletAddress(client.account.address).then(async tokenIds => {
        const promises = [],
          oinks = []
        for (var tokenId of tokenIds) {
          promises.push(axios.get(config.functions[project] + 'metadata?asset=ctn' + '&id=' + tokenId))
        }
        const results = await Promise.all(promises)
        for (var result of results) {
          oinks.push(result.data)
        }
        this.oinks = oinks
        this.loadingCTN = false
      })

      client.ownedTokens('mchh').then(async tokenIds => {
        const promises = [],
          heroes = []
        for (var tokenId of tokenIds) {
          promises.push(axios.get(config.functions[project] + 'metadata?asset=mchh' + '&id=' + tokenId))
        }
        const results = await Promise.all(promises)
        for (var result of results) {
          heroes.push(result.data)
        }
        this.heroes = heroes
        this.loadingMCHH = false
      })

      client.ownedTokens('mche').then(async tokenIds => {
        
        const promises = [],
          extensions = []
        for (var tokenId of tokenIds) {
          promises.push(axios.get(config.functions[project] + 'metadata?asset=mche' + '&id=' + tokenId))
        }
        const results = await Promise.all(promises)
        for (var result of results) {
          extensions.push(result.data)
        }
        this.extensions = extensions
        this.loadingMCHE = false
      })

      client.ownedTokens('mrm').then(async tokenIds => {
        const promises = [],
          records = []
        for (var tokenId of tokenIds) {
          promises.push(axios.get(config.functions[project] + 'metadata?asset=mrm' + '&id=' + tokenId))
        }
        
        const results = await Promise.all(promises)
        
        for (var result of results) {
          records.push(result.data)
        }
  
        this.records = records
        this.loadingMRM = false
      })

      this.transactions = await firestore.getHistoryByAddress(client.account.address)
      this.order = await firestore.getValidOrdersByMaker(client.account.address)

      const result = await firestore.doc('user', client.account.address)
      if (result) {
        if(result.mch_artedit){
        this.switch1 = result.mch_artedit
        }else{
          this.switch1 = false
        }
      } else {
        this.switch1 = false
      }
    }
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    lang() {
      return this.$store.state.i18n.locale
    },
    selling() {
      const result = []
      for (const order of this.order) {
        result.push(order.id)
      }
      return result
    }
  },
  methods: {
    async twitterLogin() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    twitterLogout () {

      firebase.auth().signOut()
    },
    coolDownIndexToSpeed(index) {
      return lib.coolDownIndexToSpeed(index)
    },
    getRarity(asset, type) {
      return lib.getRarity(asset, type)
    },
    fromWei(wei) {
      return client.utils.fromWei(wei)
    },
    timeConverter(timestamp) {
      return lib.timeConverter(timestamp)
    },
    toAsset(asset) {
      return lib.toAsset(asset)
    },
    async twitterDataPass() {
    try {
      
      if(this.isLogin){

      
      
      const sig =await client.signUserForTwitter()
      const datas = {
          sig: sig,
          address: client.account.address,
          twitterAccount: this.twitterAccount.providerData
      }
      this.isSigned = true

      var twitterStoredState = this.twitterAccount.providerData[0]
      twitterStoredState.isSigned = this.isSigned
      this.$store.dispatch('account/setTwitterAccount', twitterStoredState)

      await functions.call('spTwitter', datas)
      
      }
    } catch (err) {
      console.log("error",err)
    }
    },
    async permitArtedit() {
      try {
        const sig = await client.signUser()
        const switch1 = this.switch1
        var date = new Date()
        const datas = {
          sig: sig,
          address: client.account.address,
          status: switch1,
          modified: await date.getTime()
        }
        await functions.call('spArteditUserSign', datas)
      } catch (err) {
        alert(this.$t('error.message'))
        const result = await firestore.doc('user', client.account.address)
        if (result) {
          this.switch1 = result.mch_artedit
        } else {
          this.switch1 = result.mch_artedit
        }
      }
    }
  }
}
</script>
