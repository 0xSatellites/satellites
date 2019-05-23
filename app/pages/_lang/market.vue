<template>
  <div>
    <section class="l-personal">
      <section class="c-index c-index--recommend">
        <h2 class="l-personal__title">{{ $t('market.title') }}</h2>
        <v-container fluid grid-list-xl>
          <v-layout wrap align-center>
            <v-flex xs12 sm6 d-flex>
              <v-select v-on:change="setAsset" :items="assets" item-text="name" item-value="marketAsset" label="asset" v-model="selectedAsset" attach></v-select>
            </v-flex>

            <v-flex xs12 sm6 d-flex>
              <v-select v-on:change="setSort" :items="sorts" item-text="name" item-value="sortBy" label="sort" v-model="selectedSort" attach></v-select>
            </v-flex>
            <v-flex v-model="valid" xs12 d-flex v-if="selectedAsset == 'mchh' || selectedAsset == 'mche'">
              <v-text-field v-model="searchName" :rules="nameRules" :counter="20" :label="$t('market.search')" required @keyup="search()"></v-text-field>
            </v-flex>
            <v-flex xs12 d-flex v-if="selectedAsset == 'mchh' || selectedAsset == 'mche'">
              <div class="slidecontainer">
                Rarity: {{ search_rarity }}
                <input type="range" min="1" max="5" value="3" class="slider" id="rarityRange" v-model="search_rarity" @change="updateRange()" />
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <ul>
          <li v-for="(order, i) in orders" :key="i + '-order'">
            <nuxt-link :to="'/' + lang + '/' + order.assetName + '/order/' + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="i in getRarity(order)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img pa-4" v-if="order.assetName == 'mche' || order.assetName == 'mchh'"><img :src="order.metadata.image" /></div>
              <div class="c-card__img" v-else><img :src="order.metadata.image" /></div>
              <div class="c-card__name" v-if="order.assetName == 'ck' || order.assetName == 'ctn'">{{ order.metadata.name }}</div>
              <div class="c-card__name" v-if="order.assetName == 'mchh'">{{ order.metadata.hero_type.name[lang] }}</div>
              <div class="c-card__name" v-if="order.assetName == 'mche'">{{ order.metadata.extension_type.name[lang] }}</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt" v-if="order.assetName == 'ck' || order.assetName == 'ctn'">
                Gen {{ order.metadata.generation }} : {{ coolDownIndexToSpeed(order.metadata.status.cooldown_index) }}
              </div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
          </li>
        </ul>
      </section>
      <br />
      <br />
      <div class="text-xs-center" v-if="pagenation">
        <v-pagination v-model="offset" :length="limit"></v-pagination>
      </div>
    </section>
  </div>
</template>
<script>
import firestore from '~/plugins/firestore'
import client from '~/plugins/ethereum-client'
import lib from '~/plugins/lib'

const config = require('../../../functions/config.json')
const project = process.env.project

export default {
  data() {
    return {
      pagenation: true,
      limit: 0,
      offset: 0,
      search_rarity_status: false,
      search_rarity: 0,
      selectedAsset: 'all',
      selectedSort: 'created?desc',
      assets: [
        {
          name: 'All',
          marketAsset: 'all'
        },
        {
          name: 'CryptoKitties',
          marketAsset: 'ck'
        },
        {
          name: 'Crypt-Oink',
          marketAsset: 'ctn'
        },
        {
          name: 'MyCryptoHeros Hero',
          marketAsset: 'mchh'
        },
        {
          name: 'MyCryptoHeros Extension',
          marketAsset: 'mche'
        }
      ],
      sorts: [
        {
          name: 'Lowest Price',
          sortBy: 'price_sort?asc'
        },
        {
          name: 'Highest Price',
          sortBy: 'price_sort?desc'
        },
        {
          name: 'Latest Order',
          sortBy: 'created?desc'
        },
        {
          name: 'Oldest Order',
          sortBy: 'created?asc'
        }
      ],
      searchName: '',
      valid: false,
      nameRules: [v => v.length <= 20 || 'Name must be less than 20 characters']
    }
  },
  async asyncData({ store, params, query }) {
    const limit = Math.ceil((await firestore.getMarketLength()) / 20)
    const marketAsset = 'all'
    const sortBy = 'created'
    const marketOrder = 'desc'
    var offset
    if (query.page) {
      offset = query.page
    } else {
      offset = 1
    }
    const orders = await firestore.getMarket(marketAsset, sortBy, marketOrder, offset)
    await store.dispatch('order/setOrders', orders)
    var pagenation = true
    if (limit <= 1) {
      pagenation = false
    }
    return { limit: limit, pagenation: pagenation }
  },
  async mounted() {},
  computed: {
    orders() {
      return this.$store.getters['order/orders']
    },
    lang() {
      return this.$store.state.i18n.locale
    }
  },
  watch: {
    offset: async function(newNumber) {
      this.$router.push({
        path: 'market',
        query: { page: newNumber }
      })
      const marketAsset = 'all'
      const sortBy = 'created'
      const marketOrder = 'desc'
      const orders = await firestore.getMarket(marketAsset, sortBy, marketOrder, newNumber)
      await this.$store.dispatch('order/setOrders', orders)
    }
  },
  methods: {
    async search() {
      const marketAsset = 'all'
      const sortBy = 'created'
      const marketOrder = 'desc'
      const result = await firestore.getMarket(marketAsset, sortBy, marketOrder)
      await this.$store.dispatch('order/setOrders', result)
      var searchs = []
      var i = 0
      const name = this.searchName.toLowerCase().replace(/\s+/g, '')
      while (i < this.orders.length) {
        var order = this.orders[i]
        var words = []
        var x = 0
        var count = 0
        if (!order.metadata.attributes) {
          i++
          continue
        }
        if (this.selectedAsset === 'mchh' && !order.metadata.attributes.extension_name) {
          words = order.metadata.attributes.hero_name.split(' ')
        } else if (this.selectedAsset === 'mche' && !order.metadata.attributes.hero_name) {
          words = order.metadata.attributes.extension_name.split(' ')
        }
        while (x < words.length) {
          if (~words[x].toLowerCase().indexOf(name) && words[x] !== '') {
            if (count === 0) {
              searchs.push(order)
              count++
            }
            x++
          } else if (~name.indexOf(words[x].toLowerCase().replace(/\s+/g, '')) && words[x] !== '') {
            if (count === 0) {
              searchs.push(order)
              count++
            }
            x++
          }
          x++
        }
        i++
      }
      await this.$store.dispatch('order/setOrders', searchs)
    },
    coolDownIndexToSpeed(index) {
      return lib.coolDownIndexToSpeed(index)
    },
    getRarity(asset) {
      return lib.getRarity(asset)
    },
    fromWei(wei) {
      return client.utils.fromWei(wei)
    },
    async updateRange() {
      this.searchName = ''
      this.search_rarity_status = true
      var splits = this.selectedSort.split('?')
      var keys = ['rarity']
      var values = [this.search_rarity]
      var result = await firestore.getMarketWithConditions(this.selectedAsset, splits[0], splits[1], keys, values)
      await this.$store.dispatch('order/setOrders', result)
    },
    async setAsset() {
      this.pagenation = false
      var splits = this.selectedSort.split('?')
      const orders = await firestore.getMarket(this.selectedAsset, splits[0], splits[1])
      await this.$store.dispatch('order/setOrders', orders)
    },
    async setSort() {
      this.pagenation = false
      var splits = this.selectedSort.split('?')
      const orders = await firestore.getMarket(this.selectedAsset, splits[0], splits[1])
      await this.$store.dispatch('order/setOrders', orders)
    }
  }
}
</script>
<style>
.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 2.5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
}
</style>
