<template>
<div>
  <v-layout justify-center>
    <v-flex xs12 sm8 md6 >
      <img src="~/assets/img/bazaaar/screen_transparent.png" width="100%" class="pa-3"></img> 
        <div class="text-xs-center my-3">
          <span class='grey--text' >
            デジタルアセットの売買マッチングサービス
          </span>
        </div>
    </v-flex>
  </v-layout>
  <v-layout row wrap align-center>
    <v-flex xs12 md4>
      <v-card class="elevation-0 transparent">
        <v-card-text class="text-xs-center">
          <v-icon large color="blue">account_balance_wallet</v-icon>
        </v-card-text>
        <v-card-title class="justify-center">
          <div class="headline text-xs-center">手数料無料</div>
        </v-card-title>
        <v-card-text>
          <div class="text-xs-center">スマートコントラクトを使用することで取引にかかる手数料は完全無料です。</div>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md4>
      <v-card class="elevation-0 transparent">
        <v-card-text class="text-xs-center">
          <v-icon large color="blue">flash_on</v-icon>
        </v-card-text>
        <v-card-title class="justify-center">
          <div class="headline">ホワイトリスト</div>
        </v-card-title>
        <v-card-text>
          <div class="text-xs-center">現状、仮想通貨に該当しないと解釈されているデジタルアセットのみを扱っています。</div>          
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md4>
      <v-card class="elevation-0 transparent">
        <v-card-text class="text-xs-center">
          <v-icon large color="blue">people</v-icon>
        </v-card-text>
        <v-card-title class="justify-center">
          <div class="headline text-xs-center">オープンソース</div>
        </v-card-title>
        <v-card-text>
          <div class="text-xs-center">ソースコードは公開されており、誰でも開発に参加することができます。</div>
        </v-card-text>
      </v-card>
    </v-flex>

  </v-layout>

</div>
</template>
<script>

  import axios from 'axios'
  import contract from '~/assets/js/contract';

  export default {
    data() {
      return {
        initialising: true,        
        loading: false,
        // heroes: [{"name":"MCH Hero: #30040157 Lv.1","description":"HeroName: Mata Hari","image":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","attributes":{"active_skill":"Rest","agi":20,"hero_name":"Mata Hari","hp":45,"id":30040157,"int":19,"lv":1,"passive_skill":"Eye of the day","phy":14,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30040157","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #30050132 Lv.1","description":"HeroName: ETHEREMON-BLUE","image":"https://www.mycryptoheroes.net/images/heroes/2000/3005.png","attributes":{"active_skill":"Rest","agi":17,"hero_name":"ETHEREMON-BLUE","hp":57,"id":30050132,"int":19,"lv":1,"passive_skill":"Omnom Tactics","phy":13,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30050132","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3005.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #20020031 Lv.1","description":"HeroName: Spartacus","image":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","attributes":{"active_skill":"Rest","agi":12,"hero_name":"Spartacus","hp":63,"id":20020031,"int":12,"lv":1,"passive_skill":"Gladiator War","phy":13,"rarity":"Uncommon"},"external_url":"https://www.mycryptoheroes.net/heroes/20020031","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #20020353 Lv.3","description":"HeroName: Spartacus","image":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","attributes":{"active_skill":"Rest","agi":13,"hero_name":"Spartacus","hp":78,"id":20020353,"int":13,"lv":3,"passive_skill":"Gladiator War","phy":14,"rarity":"Uncommon"},"external_url":"https://www.mycryptoheroes.net/heroes/20020353","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","home_url":"https://www.mycryptoheroes.net"}],
      }
    },

    /* 
    async asyncData({ store, params }) {

      await Promise.all(
        [
         store.dispatch('heroes/initial', 0),
         store.dispatch('heroes/balance')
         ]
      )

    },
    */

    mounted: async function() {
        await Promise.all(
          [
            this.$store.dispatch('orders/initial')
          ]
        )
    },    

    computed: {
      orders() {
        return this.$store.getters['orders/orders']
      },
    },

    methods: {
      // ...mapGetters('questions', ['questions'])

    },


  }

</script>