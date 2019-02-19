<template>
  <div>
    <section class="l-personal">
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
    <section class="c-index c-index--mypage">
      <ul>
        <v-progress-circular
          class="loading "
          v-if="this.loading === true"
          :size="50"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <li v-for="(ck, i) in myitems" :key="i + '-ck'" v-else>
          <div>
            <nuxt-link :to="'/ck/' + ck.id" class="c-card">
            <div class="c-card__label--exhibit">出品中</div>
              <div class="c-card__img"><img :src="ck.image_url" /></div>
              <div class="c-card__name">Gen.{{ ck.generation }}</div>
              <div class="c-card__txt"># {{ ck.id }}</div>
              <div class="c-card__txt">Crypto Kitties</div>
            </nuxt-link>
          </div>
        </li>
      </ul>
    </section>

    <!--
    <section class="c-index c-index--mypage">
      <v-data-table :headers="headers" :items="orders" class="elevation-1">
        <template slot="items" scope="props">
          <td>{{ props.item.status }}</td>
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.metadata.name }}</td>
          <td>{{ props.item.price / 1000000000000000000 }}</td>
        </template>
      </v-data-table>
    </section>
    -->

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
        .getOrdersByMaker(client.account.address)
        .then(orders => store.dispatch('order/setOrders', orders))
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
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'ステータス',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'id', value: 'calories' },
        { text: 'アセット', value: 'fat' },
        { text: '価格', value: 'price' }
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
