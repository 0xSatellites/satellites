<template>
<div>
    <section class="l-personal">
        <section class="c-index c-index--recommend">
            <h2 class="l-personal__title">{{ $t('market.title') }}</h2>
             <v-container fluid grid-list-xl>
                <v-layout wrap align-center>
                <v-flex xs12 sm6 d-flex>
                    <v-select
                    v-on:change="setAsset"
                    :items="assets"
                    item-text="name"
                    item-value="marketAsset"
                    label="asset"
                    v-model="selectedAsset"
                    attach
                    ></v-select>
                </v-flex>

                <v-flex xs12 sm6 d-flex>
                    <v-select
                    v-on:change="setSort"
                    :items="sorts"
                    item-text="name"
                    item-value="sortBy"
                    label="sort"
                    v-model="selectedSort"
                    attach
                    ></v-select>
                </v-flex>
              <v-flex xs12 d-flex v-if="selectedAsset=='mchh' || selectedAsset=='mche'">
                <div class="slidecontainer">
                  Rarity: {{search_rarity}}
                  <input type="range" min="1" max="5" value="3" class="slider" id="rarityRange" v-model="search_rarity" @change="updateRange()">
                </div>
              </v-flex>
            </v-layout>
            </v-container>


        <ul>
        <li v-for="(order, i) in orders" :key="i + '-ck'">
            <nuxt-link v-if="order.asset === ck" :to="$t('index.holdLanguageCK') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.name">{{ order.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Gen {{order.metadata.generation}} : {{coolDownIndexToSpeed(order.metadata.status.cooldown_index)}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
            <nuxt-link v-else-if="order.asset === ctn" :to="$t('index.holdLanguageCTN') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.name">{{ order.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Gen {{order.metadata.generation}} : {{coolDownIndexToSpeed(Number(order.metadata.status.cooldown_index))}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
            <nuxt-link v-else-if="order.asset === mchh" :to="$t('index.holdLanguageMCHH') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.attributes.hero_name">{{ order.metadata.attributes.hero_name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Lv. {{order.metadata.attributes.lv}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
            <nuxt-link v-else-if="order.asset === mche" :to="$t('index.holdLanguageMCHE') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.attributes.hero_name">{{ order.metadata.attributes.hero_name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Lv. {{order.metadata.attributes.lv}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
        </li>
        </ul>
        </section>
    </section>
</div>
</template>
<script>
import firestore from '~/plugins/firestore'
import client from '~/plugins/ethereum-client'
import kitty from '~/plugins/kitty'
import oink from '~/plugins/oink'
import common from '~/plugins/common'

const config = require('../../config.json')
const project = process.env.project
const ck = config.contract[project].ck
const ctn = config.contract[project].ctn
const mchh = config.contract[project].mchh
const mche = config.contract[project].mche


export default {
  data() {
    return {
        ck,
        ctn,
        mchh,
        mche,
        search_rarity_status: false,
        search_rarity: 0,
        selectedAsset: 'all',
        selectedSort:'created?desc',
        assets:[
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
        },
        ],
        sorts:[
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
        ]
      }
  },
  async asyncData({ store, params }) {
    const marketAsset = 'all'
    const sortBy = 'created'
    const marketOrder = 'desc'
    const orders = await firestore.getMarket(marketAsset, sortBy ,marketOrder)
    await store.dispatch('order/setOrders', orders)
  },
  mounted() {
  },
  computed: {
    orders() {
      return this.$store.getters['order/orders']
    },
  },
  methods: {
    coolDownIndexToSpeed(index) {
      return kitty.coolDownIndexToSpeed(index)
    },
    getRarity(asset) {
      return common.getRarity(asset)
    },
    fromWei(wei) {
        return client.utils.fromWei(wei)
    },
    updateRange() {
      this.search_rarity_status = true
    },
    async setAsset(){
        var splits = this.selectedSort.split('?');
        const orders = await firestore.getMarket(this.selectedAsset, splits[0] ,splits[1])
        await this.$store.dispatch('order/setOrders', orders)
    },
    async setSort(){
        var splits = this.selectedSort.split('?');
        const orders = await firestore.getMarket(this.selectedAsset, splits[0] ,splits[1])
        await this.$store.dispatch('order/setOrders', orders)
    },
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
  -webkit-transition: .2s;
  transition: opacity .2s;
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