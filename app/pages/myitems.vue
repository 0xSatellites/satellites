<template>
    <div>
      <section class="l-personal">
        <h2 class="l-personal__title">マイページ</h2>

        <div class="l-personal__frame">
        <dl class="l-personal__address">
        <dt>アドレス：</dt>
        <dd>{{account.address}}</dd>
        </dl>

        <dl class="l-personal__balance">
        <dt>残高：</dt>
        <dd>{{account.balance / 1000000000000000000 }}  ETH</dd>
        </dl>
        </div>
      </section>
      <section class="c-index c-index--mypage">
        <ul>
          <li v-for="(mchh, i) in myitems.mchh" :key="i + '-mchh'">
          <div>
              <nuxt-link :to="'/mchh/' + mchh.attributes.id" class="c-card">
                  <div class="c-card__label c-card__label__rarity--1">★1</div>
                  <div class="c-card__label--exhibit">出品可能</div>
                  <div class="c-card__img"><img :src="mchh.image_url"></div>
                  <div class="c-card__name">{{mchh.hero_type.name.ja}} / LV.{{mchh.attributes.lv}}</div>
                  <div class="c-card__txt"># {{mchh.attributes.id}}</div>
                  <div class="c-card__txt">My Crypto Heores</div>
              </nuxt-link>
            </div>
          </li>
          <li v-for="(mche, i) in myitems.mche" :key="i + '-mche'">
          <div>
              <nuxt-link :to="'/mche/' + mche.external_url.slice(-8) " class="c-card">
                  <div class="c-card__label c-card__label__rarity--1">★1</div>
                  <div class="c-card__label--exhibit">出品可能</div>
                  <div class="c-card__img"><img :src="mche.image_url"></div>
                  <div class="c-card__name">{{mche.extension_type.name.ja}} / LV.{{mche.attributes.lv}}</div>
                  <div class="c-card__txt"># {{mche.external_url.slice(-8)}}</div>
                  <div class="c-card__txt">My Crypto Heores</div>
              </nuxt-link>
            </div>
          </li>
          <li v-for="(ck, i) in myitems.ck" :key="i + '-ck'">
          <div>
              <nuxt-link :to="'/ck/' + ck.id " class="c-card">
                  <div class="c-card__label c-card__label__rarity--1">★1</div>
                  <div class="c-card__label--exhibit">出品可能</div>
                  <div class="c-card__img"><img :src="ck.image_url"></div>
                  <div class="c-card__name">{{ck.name}} / Gen.{{ck.generation}}</div>
                  <div class="c-card__txt"># {{ck.id}}</div>
                  <div class="c-card__txt">Crypto Kitties</div>
              </nuxt-link>
            </div>
          </li>
        </ul>
      </section>

      <!-- <section class="c-index c-index--mypage">
         <v-data-table
          :headers="headers"
          :items="order"
          class="elevation-1"
        >
          <template slot="items" scope="props">
            <td>{{ props.item.status }}</td>
            <td>{{ props.item.id }}</td>
            <td >{{ props.item.metadata.hero_type.name.ja }}  / lv.{{ props.item.metadata.attributes.lv }}</td>
            <td >{{ props.item.price / 1000000000000000000}}</td>
          </template>
        </v-data-table>

      </section> -->
    </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
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

        const order = await firestore.docs('order', 'maker', '==', account.address)
        store.dispatch('order/setOrder', order)
      }
      if (!myitems.mchh.length) {
        //get myitems:mchh
        client.ownedTokens('mchh').then(async function(tokens) {
          const promises = []
          for(var token of tokens){
            promises.push(functions.call('metadata', {asset:'mchh', id:token}))
          }
          const result = await Promise.all(promises)
          store.dispatch('myitems/setMchh', result)
        })
      }
      if (!myitems.mche.length) {
        //get myitems:mche
        client.ownedTokens('mche').then(async function(tokens) {
          const promises = []
          for(var token of tokens){
            promises.push(functions.call('metadata', {asset:'mche', id:token}))
          }
          const result = await Promise.all(promises)
          store.dispatch('myitems/setMche', result)
        })
      }
      if (!myitems.ck.length) {
        //get myitems:ck
        const result = await client.ownedTokensCk('ck')
        console.log(result)
        store.dispatch('myitems/setCk', result)
        // client.ownedTokensCk('ck').then(async function(tokens) {
          // const promises = []
          // for(var token of tokens){
          //   promises.push(functions.call('metadata', {asset:'ck', id:token}))
          // }
          // const result = await Promise.all(promises)
        //   const result = tokens
        //   console.log(result)
        //   store.dispatch('myitems/setCk', result)
        // })
        // const result = await client.ownedTokensCk('ck')
        // console.log(result)
        // store.dispatch('myitems/setCk', result)
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
  data () {
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
          { text: '価格', value: 'price' },
        ],
      }
    }
}
</script>