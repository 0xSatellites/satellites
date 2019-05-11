<template>
<section class="c-index c-index--recommend  mt-5">
  <h2 class="c-index__title">{{$t('index.newAssets')}}</h2>
    <ul>
      <li v-for="(recommend, i) in recommend" :key="i + '-recommend'">
          <nuxt-link :to="'/' + lang + '/' + recommend.assetName + '/order/' + recommend.hash" class="c-card">
            <div class="c-card__label c-card__label__rarity--5"><span v-for="i in getRarity(recommend)" :key="i + '-rarity'">★</span></div>
            <div class="c-card__img pa-4" v-if="recommend.assetName == 'mche' || recommend.assetName == 'mchh'"><img :src="recommend.metadata.image" /></div>
            <div class="c-card__img" v-else><img :src="recommend.metadata.image" /></div>
            <div class="c-card__name" v-if="recommend.metadata.name">{{ recommend.metadata.name }}</div>
            <div class="c-card__name" v-else>Gonbee</div>
            <div class="c-card__txt"># {{ recommend.id }}</div>
            <div class="c-card__txt" v-if="recommend.assetName == 'ck' || recommend.assetName == 'ctn'">
              Gen {{ recommend.metadata.generation }} : {{ coolDownIndexToSpeed(recommend.metadata.status.cooldown_index) }}
            </div>
            <div class="c-card__eth">Ξ {{ fromWei(recommend.price) }} ETH</div>
          </nuxt-link>
      </li>
    </ul>
</section>
</template>

<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import lib from '~/plugins/lib'

const config = require('../config.json')
const project = process.env.project

export default {
    mounted: async function() {
      const store = this.$store
      firestore.getLatestValidOrders(4).then(recommend => {
        store.dispatch('order/setOrders', recommend)
      })
    },
    computed:{
      lang() {
        return this.$store.state.i18n.locale
      },
      recommend() {
        return this.$store.getters['order/orders']
      }
    },
    methods: {
      getRarity(asset) {
        return lib.getRarity(asset)
      },
      fromWei(wei) {
        return client.utils.fromWei(wei)
      },
      coolDownIndexToSpeed(index) {
        return lib.coolDownIndexToSpeed(index)
      },
    },
}
</script>