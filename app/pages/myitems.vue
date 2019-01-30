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
                  <!-- 出品可能 -->
                  <div class="c-card__label c-card__label__rarity--1">★1</div>
                  <div class="c-card__label--exhibit">出品可能</div>
                  <div class="c-card__img"><img :src="mchh.cache_image"></div>
                  <div class="c-card__name">{{mchh.attributes.hero_name}} / LV.{{mchh.attributes.lv}}</div>
                  <div class="c-card__txt"># {{mchh.attributes.id}}</div>
                  <div class="c-card__txt">My Crypto Heores</div>
              </nuxt-link>
            </div>
          </li>
          <li v-for="(mche, i) in myitems.mche" :key="i + '-mche'">
          <div>
              <nuxt-link :to="'/mchh/' + mche.attributes.id" class="c-card">
                  <!-- 出品可能 -->
                  <div class="c-card__label c-card__label__rarity--1">★1</div>
                  <div class="c-card__label--exhibit">出品可能</div>
                  <div class="c-card__img"><img :src="mche.cache_image"></div>
                  <div class="c-card__name">{{mche.attributes.hero_name}} / LV.{{mche.attributes.lv}}</div>
                  <div class="c-card__txt"># {{mche.attributes.id}}</div>
                  <div class="c-card__txt">My Crypto Heores</div>
              </nuxt-link>
            </div>
          </li>
        </ul>
      </section>

      <!-- <section>
        <div>
          <div v-for="(order, i) in order" :key="i">
            <div class="l-personal__frame">
              <dl class="l-personal__address">
              <dt>オーダー内容：</dt>
              <dd>
                <nuxt-link :to="'/order/' + order.proxy">
                 {{order.proxy}}
                 </nuxt-link>
              </dd>
              </dl>
              </div>
          </div>
        </div>
      </section> -->
    </div>
</template>

<script>
import db from '~/plugins/db'
import client from '~/plugins/ethereum-client'

export default {
  mounted: async function() {
    const store = this.$store
    const myitems = this.myitems
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)

        const order = await db.getOrderHistoryByAccount(account)
        await store.dispatch('order/setOrder', order)
      }
      if (!myitems.mchh.length) {
        //get myitems:mchh
        client.ownedTokens('mchh').then(function(val) {
          db.getAssetListByKey(val).then(function(val) {
            store.dispatch('myitems/setMchh', val)
          })
        })
      }
      if (!myitems.mche.length) {
        //get myitems:mche
        client.ownedTokens('mche').then(function(val) {
          db.getAssetListByKey(val).then(function(val) {
            store.dispatch('myitems/setMche', val)
          })
        })
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
  }
}
</script>