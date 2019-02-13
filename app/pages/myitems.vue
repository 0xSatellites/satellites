<template>
  <div>
    <section class="l-personal">
      <h2 class="l-personal__title">マイページ</h2>
      <div class="l-personal__frame">
        <dl class="l-personal__address">
          <dt>アドレス：</dt>
          <dd>{{ account.address }}</dd>
        </dl>
        <dl class="l-personal__balance">
          <dt>残高：</dt>
          <dd>{{ account.balance / 1000000000000000000 }} ETH</dd>
        </dl>
      </div>
    </section>
    <section class="c-index c-index--mypage">
      <ul>
        <li v-for="(ck, i) in myitems.ck" :key="i + '-ck'">
          <div>
            <nuxt-link :to="'/ck/' + ck.id" class="c-card">
              <div class="c-card__img"><img :src="ck.image_url" /></div>
              <div class="c-card__name">Gen.{{ ck.generation }}</div>
              <div class="c-card__txt"># {{ ck.id }}</div>
              <div class="c-card__txt">Crypto Kitties</div>
            </nuxt-link>
          </div>
        </li>
      </ul>
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
    const axios = this.$axios
    const store = this.$store
    const myitems = this.myitems
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)

        const order = await firestore.docs(
          'order',
          'maker',
          '==',
          account.address
        )
        store.dispatch('order/setOrder', order)
      }
      if (!myitems.ck.length) {
        //get myitems:ck
        const result = await kitty.ownedTokens(this.account.address)
        store.dispatch('myitems/setCk', result)
      }
    }
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    myitems() {
      return this.$store.getters['myitems/myitems']
    },
    order() {
      return this.$store.getters['order/order']
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
      ]
    }
  }
}
</script>
