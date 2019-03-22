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
      <h2 class="l-personal__title">Get <a href="https://metamask.io/">metamask</a> and login</h2>
    </section>

    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('assets.kitty') }}</h2>
      <ul>
        <v-progress-circular
          class="loading "
          v-if="this.loading === true"
          :size="50"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <li v-for="(ck, i) in myitems" :key="i + '-ck'" v-else-if="myitems.length">
          <div>
            <nuxt-link :to="'/ck/' + ck.id" class="c-card">
              <div class="c-card__label--exhibit" v-if='selling.includes(ck.id.toString())'>{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(ck)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="ck.image_url" /></div>
              <div class="c-card__name" v-if="ck.name">{{ ck.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ ck.id }}</div>
              <div class="c-card__txt">Gen {{ck.generation}} : {{coolDownIndexToSpeed(ck.status.cooldown_index)}}</div>
            </nuxt-link>
          </div>
        </li>

      </ul>
        <v-flex xs12 sm6 offset-sm3 v-if="!myitems.length && !this.loading">
          <a href="https://www.cryptokitties.co/">
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
    <section class="c-index c-index--mypage" v-if="account.address">
      <h2 class="l-personal__title">{{ $t('assets.oink') }}</h2>
      <ul>
        <v-progress-circular
          class="loading "
          v-if="this.loading === true"
          :size="50"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <li v-for="(ctn, i) in myoinks" :key="i + '-ctn'" v-else-if="myoinks.length">
          <div>
            <nuxt-link :to="'/ctn/' + ctn.token_id" class="c-card">
              <div class="c-card__label--exhibit" v-if='selling.includes(ctn.token_id.toString())'>{{ $t('myitems.sell') }}</div>
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(ctn)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="ctn.image_url" /></div>
              <div class="c-card__name" v-if="ctn.name">{{ ctn.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ ctn.token_id }}</div>
              <div class="c-card__txt">Gen {{ctn.generation}} : {{coolDownIndexToSpeed(ctn.cooldown_index)}}</div>
            </nuxt-link>
          </div>
        </li>

      </ul>
        <v-flex xs12 sm6 offset-sm3 v-if="!myitems.length && !this.loading">
          <a href="https://www.crypt-oink.io">
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
    <section class="c-index c-index--mypage" v-if="transactions.length">
      <v-data-table :headers="headers" :items="transactions" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ timeConverter(props.item.modified) }}</td>
          <td v-if="props.item.maker == account.address">sold</td>
          <td v-else>purchased</td>
          <td>{{ props.item.id }}</td>
          <td>{{ fromWei(props.item.price) }} ETH</td>
          <td>{{ timeConverter(props.item.modified)}}</td>
        </template>
      </v-data-table>
    </section>


  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import kitty from '~/plugins/kitty'
import oink from '~/plugins/oink'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'

export default {
  mounted: async function() {
    const myitems = this.myitems
    const myoinks = this.myoinks
    const order = this.order
    const store = this.$store
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)
      }
      this.loading = true
      kitty.getKittiesByWalletAddress(client.account.address).then(tokens => {
        this.loading = false
        store.dispatch('asset/setAssets', tokens)
      })

      oink.getOinksByWalletAddress(client.account.address).then(tokens => {
        this.loading = false
        store.dispatch('oink/setOinks', tokens)
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
    getRarity(asset) {
        return kitty.getRarity(asset)
    },
    fromWei(wei) {
        return client.utils.fromWei(wei)
    },
    timeConverter(timestamp){
      return kitty.timeConverter(timestamp)
    }
  },
  data() {
    return {
      headers: [
        { text: 'date', value: 'date' },
        { text: 'result', value: 'result' },
        { text: 'id', value: 'id' },
        { text: 'price', value: 'price' },
        { text: 'timestamp', value: 'timestamp' }
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
</style>
