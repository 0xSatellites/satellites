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
          <dd>{{ Math.round((account.balance / 1000000000000000000) * 10000 ) / 10000 }} ETH</dd>
        </dl>
      </div>
    </section>
    <section class="l-personal" v-else>
      <h2 class="l-personal__title">Get <a href="https://metamask.io/" target="_blank">metamask</a> or</h2>
      <h2 class="l-personal__title">Get <a href="https://tokenpocket.github.io/applink?dappUrl=https://bazaaar.io/" target="_blank">TokenPocket</a> or</h2>
      <h2 class="l-personal__title">Get <a href="https://www.go-wallet.app/" target="_blank">GO!WALLET</a> and login</h2>
    </section>
    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('assets.mch') }}</h2>
      <ul>
        <v-progress-circular
          class="loading "
          v-if="loading"
          :size="50"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <li v-for="(mchh, i) in myheros" :key="i + '-mchh'" v-else-if="myheros.length">
          <div>
            <nuxt-link :to="'/mchh/' + mchh.attributes.id" class="c-card">
              <div class="c-card__label--exhibit" v-if='selling.includes(mchh.attributes.id.toString())'>{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(mchh, 'mchh')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img class="pa-4" :src="mchh.image_url" /></div>
              <div class="c-card__name" v-if="mchh.attributes.hero_name">{{ mchh.attributes.hero_name.substring(0,25) }} / Lv: {{mchh.attributes.lv}}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ mchh.attributes.id }}</div>
            </nuxt-link>
          </div>
        </li>
        <v-flex xs12 sm6 offset-sm3 v-if="!myextensions.length && !loading && !myheros.length">
          <a href="https://www.mycryptoheroes.net">
                <v-card>
                  <v-img
                  v-bind:src="require('~/assets/img/asset/MyCryptoHeros.png')"
                  aspect-ratio="1.75"
                  contain
                  ></v-img>
                  <v-card-title primary-title>
                  <div class="text-box">
                      <h3 class="headline mb-0">{{ $t('empty.mch') }}</h3>
                      <h3 class="headline mb-0">{{ $t('empty.mch_maintenance') }}</h3>
                  </div>
                  </v-card-title>
                </v-card>
              </a>
          </v-flex>
      </ul>
    </section>
    <section class="c-index c-index--mypage" v-if="account.address">
      <ul v-if="myextensions.length">
        <li v-for="(mche, i) in myextensions" :key="i + '-mche'" >
          <div>
            <nuxt-link :to="'/mche/' + mche.attributes.id" class="c-card">
              <div class="c-card__label--exhibit" v-if='selling.includes(mche.attributes.id.toString())'>{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(mche, 'mche')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img class="pa-4" :src="mche.image_url" /></div>
              <div class="c-card__name" v-if="mche.attributes.extension_name">{{ mche.attributes.extension_name.substring(0,25) }} / Lv: {{mche.attributes.lv}}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ mche.attributes.id }}</div>
            </nuxt-link>
          </div>
        </li>

      </ul>
    </section>

    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('assets.oink') }}</h2>
      <ul>
        <v-progress-circular
          class="loading "
          v-if="this.loadingCTN"
          :size="50"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <li v-for="(ctn, i) in myoinks" :key="i + '-ctn'" v-else-if="myoinks.length">
          <div>
            <nuxt-link :to="'/ctn/' + ctn.id" class="c-card">
              <div class="c-card__label--exhibit" v-if='selling.includes(ctn.id.toString())'>{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(ctn, 'ctn')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="ctn.image" /></div>
              <div class="c-card__name" v-if="ctn.name">{{ ctn.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ ctn.id }}</div>
              <!-- <div class="c-card__txt">Gen {{ctn.generation}} : {{oinkCoolDownIndexToSpeed(3)}}</div> -->
            </nuxt-link>
          </div>
        </li>

      </ul>
        <v-flex xs12 sm6 offset-sm3 v-if="!myoinks.length && !this.loadingCTN">
          <a href="https://www.crypt-oink.io" target="_blank">
                <v-card>
                  <v-img
                  v-bind:src="require('~/assets/img/asset/Crypt_Oink.png')"
                  aspect-ratio="1.75"
                  ></v-img>
                  <v-card-title primary-title>
                  <div class="text-box">
                      <h3 class="headline mb-0">{{ $t('empty.oink') }}</h3>
                  </div>
                  </v-card-title>
                </v-card>
              </a>
          </v-flex>
    </section>

    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('assets.kitty') }}</h2>
      <ul>
        <v-progress-circular
          class="loading "
          v-if="this.loadingCK"
          :size="50"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <li v-for="(ck, i) in myitems" :key="i + '-ck'" v-else-if="myitems.length">
          <div>
            <nuxt-link :to="'/ck/' + ck.id" class="c-card">
              <div class="c-card__label--exhibit" v-if='selling.includes(ck.id.toString())'>{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(ck, 'ck')" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="ck.image_url" /></div>
              <div class="c-card__name" v-if="ck.name">{{ ck.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ ck.id }}</div>
              <div class="c-card__txt">Gen {{ck.generation}} : {{coolDownIndexToSpeed(ck.status.cooldown_index)}}</div>
            </nuxt-link>
          </div>
        </li>

      </ul>
        <v-flex xs12 sm6 offset-sm3 v-if="!myitems.length && !this.loadingCK">
          <a href="https://www.cryptokitties.co/" target="_blank">
                <v-card>
                  <v-img
                  v-bind:src="require('~/assets/img/asset/CryptoKitties.png')"
                  aspect-ratio="1.75"
                  ></v-img>
                  <v-card-title primary-title>
                  <div class="text-box">
                      <h3 class="headline mb-0">{{ $t('empty.kitty') }}</h3>
                  </div>
                  </v-card-title>
                </v-card>
              </a>
          </v-flex>
    </section>

    <!-- 履歴 -->
    <section class="c-index c-index--mypage" v-if="transactions.length">
      <v-data-table :headers="headers" :items="transactions" class="elevation-1">
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
import common from '~/plugins/common'
import kitty from '~/plugins/kitty'
import oink from '~/plugins/oink'
import hero from '~/plugins/hero'
import extension from '~/plugins/extension'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'

export default {
  mounted: async function() {
    const myitems = this.myitems
    const myoinks = this.myoinks
    const myheros = this.myheros
    const myextensions = this.myextensions
    const order = this.order
    const store = this.$store
    var account
    if (typeof web3 != 'undefined' || window.ethereum) {
      if (!client.account.address) {
        if(window.ethereum){
          account = await client.activate(ethereum)
        } else {
          account = await client.activate(web3.currentProvider)
        }
        store.dispatch('account/setAccount', account)
      }
      this.loadingCK = true
      this.loadingCTN = true
      this.loading = false


      kitty.getKittiesByWalletAddress(client.account.address).then(tokens => {
        this.loadingCK = false
        console.log(this)
        store.dispatch('asset/setAssets', tokens)
      })

      oink.getOinksByWalletAddress(client.account.address).then(tokens => {
        this.loadingCTN = false
        store.dispatch('oink/setOinks', tokens)
      })

      client.ownedTokens('mchh').then(async function(tokens) {
          const promises = []
          for(var token of tokens){
            promises.push(await functions.call('metadata', {asset:'mchh', id:token}))
          }
          const result = await Promise.all(promises)
          store.dispatch('hero/setHeros', result)
      })

      client.ownedTokens('mche').then(async function(tokens) {
          const promises = []
          for(var token of tokens){
            promises.push(await functions.call('metadata', {asset:'mche', id:token}))
          }
          const result = await Promise.all(promises)
          store.dispatch('extension/setExtensions', result)
      })

      firestore
        .getValidOrdersByMaker(client.account.address)
        .then(orders => store.dispatch('order/setOrders', orders))

      firestore
        .getHistoryByAddress(client.account.address)
        .then(transactions => { store.dispatch('transaction/setTransactions', transactions)})


    }
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    myitems() {
      return this.$store.getters['asset/assets']
    },
    myoinks() {
      return this.$store.getters['oink/oinks']
    },
    myheros() {
      return this.$store.getters['hero/heros']
    },
    myextensions() {
      return this.$store.getters['extension/extensions']
    },
    orders() {
      return this.$store.getters['order/orders']
    },
    transactions() {
      return this.$store.getters['transaction/transactions']
    },
    selling() {
      const result = []
      for (const order of this.$store.getters['order/orders']) {
        result.push(order.id)
      }
      return result
    }
  },
  methods: {
    coolDownIndexToSpeed(index) {
      return kitty.coolDownIndexToSpeed(index)
    },
    getRarity(asset, type) {
        return common.getRarity(asset, type)
    },
    fromWei(wei) {
        return client.utils.fromWei(wei)
    },
    timeConverter(timestamp){
      return kitty.timeConverter(timestamp)
    },
    toAsset(asset){
      return client.toAsset(asset)
    }
    // oinkCoolDownIndexToSpeed(index){
    //   oink.coolDownIndexToSpeed(index)
    //   .then(result => {
    //     console.log(result)
    //     return result
    //   })
    // }

  },
  data() {
    return {
      headers: [
        { text: 'date', value: 'date' },
        { text: 'result', value: 'result' },
        { text: 'asset', value: 'asset' },
        { text: 'id', value: 'id' },
        { text: 'price', value: 'price' }
      ],
      loading: false
    }
  }
}
</script>

<style scoped>
.loading {
  margin: auto;
  margin-top: 30px;
  display: block;
}

.text-box{
  margin: auto;
}
</style>
