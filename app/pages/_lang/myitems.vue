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
          <dd>{{ account.balance / 1000000000000000000 }} ETH</dd>
        </dl>
      </div>
    </section>
    <section class="l-personal" v-else>
      <h2 class="l-personal__title">get metamask and login</h2>
    </section>
    <section class="c-index c-index--mypage">
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
            <div class="c-card__label--exhibit" v-if='selling.includes(ck.id.toString())'>出品中</div>
              <div class="c-card__img"><img :src="ck.image_url" /></div>
              <div class="c-card__name">Gen.{{ ck.generation }}</div>
              <div class="c-card__txt"># {{ ck.id }}</div>
              <div class="c-card__txt">Crypto Kitties</div>
            </nuxt-link>
          </div>
        </li>
        <div v-else>No kitty!!</div>
      </ul>
    </section>

    <section class="c-index c-index--mypage" v-if="transactions.length">
      <v-data-table :headers="headers" :items="transactions" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td v-if="props.item.maker == account.address">sold</td>
          <td v-else>purchased</td>
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.price / 1000000000000000000 }} ETH</td>
        </template>
      </v-data-table>
    </section>

  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import kitty from '~/plugins/kitty'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'

export default {
  mounted: async function() {
    const myitems = this.myitems
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
  data() {
    return {
      headers: [
        { text: 'result', value: 'result' },
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
</style>
