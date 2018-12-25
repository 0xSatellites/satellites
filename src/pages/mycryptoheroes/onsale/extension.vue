
<template>
  <v-layout>
    <div class="text-xs-center centered-element" v-if="initialising">
      <v-progress-circular
        indeterminate
      ></v-progress-circular>
    </div>
    <v-layout row wrap>
      <v-flex xs6 sm4 lg2 v-for="(item,i) in extensions" :key="i">
          <v-card class="rounded ma-2" :to="'../detail/extension/' + item.name.substring(16, 24)">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{item.attributes.rarity}}</div>
                <span class="grey--text">Lv. {{item.attributes.lv}}</span>
              </div>
            </v-card-title>
            <v-card-text><img v-bind:src="item.image" width="100%" alt=""></v-card-text>
            <v-card-text>{{item.attributes.extension_name}}</v-card-text>
            <v-card-actions><v-btn block>0.002ETH</v-btn></v-card-actions>
          </v-card>
      </v-flex>
      <v-btn block color="grey darken-3 rounded" @click="load" v-if="0 < extensions.length && extensions.length < balance">
      Load More
      <v-progress-circular size=18 class="ma-2" v-if="loading"
        indeterminate
      ></v-progress-circular>      
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>

  import axios from 'axios'

  export default {
    data() {
      return {
        initialising: true,
        loading: false
        //extensions: [{"name":"MCH Hero: #30040157 Lv.1","description":"HeroName: Mata Hari","image":"https://www.mycryptoextensions.net/images/extensions/2000/3004.png","attributes":{"active_skill":"Rest","agi":20,"hero_name":"Mata Hari","hp":45,"id":30040157,"int":19,"lv":1,"passive_skill":"Eye of the day","phy":14,"rarity":"Rare"},"external_url":"https://www.mycryptoextensions.net/extensions/30040157","image_url":"https://www.mycryptoextensions.net/images/extensions/2000/3004.png","home_url":"https://www.mycryptoextensions.net"},{"name":"MCH Hero: #30050132 Lv.1","description":"HeroName: ETHEREMON-BLUE","image":"https://www.mycryptoextensions.net/images/extensions/2000/3005.png","attributes":{"active_skill":"Rest","agi":17,"hero_name":"ETHEREMON-BLUE","hp":57,"id":30050132,"int":19,"lv":1,"passive_skill":"Omnom Tactics","phy":13,"rarity":"Rare"},"external_url":"https://www.mycryptoextensions.net/extensions/30050132","image_url":"https://www.mycryptoextensions.net/images/extensions/2000/3005.png","home_url":"https://www.mycryptoextensions.net"},{"name":"MCH Hero: #20020031 Lv.1","description":"HeroName: Spartacus","image":"https://www.mycryptoextensions.net/images/extensions/2000/2002.png","attributes":{"active_skill":"Rest","agi":12,"hero_name":"Spartacus","hp":63,"id":20020031,"int":12,"lv":1,"passive_skill":"Gladiator War","phy":13,"rarity":"Uncommon"},"external_url":"https://www.mycryptoextensions.net/extensions/20020031","image_url":"https://www.mycryptoextensions.net/images/extensions/2000/2002.png","home_url":"https://www.mycryptoextensions.net"},{"name":"MCH Hero: #20020353 Lv.3","description":"HeroName: Spartacus","image":"https://www.mycryptoextensions.net/images/extensions/2000/2002.png","attributes":{"active_skill":"Rest","agi":13,"hero_name":"Spartacus","hp":78,"id":20020353,"int":13,"lv":3,"passive_skill":"Gladiator War","phy":14,"rarity":"Uncommon"},"external_url":"https://www.mycryptoextensions.net/extensions/20020353","image_url":"https://www.mycryptoextensions.net/images/extensions/2000/2002.png","home_url":"https://www.mycryptoextensions.net"}],
      }
    },
/*
    async asyncData({ store, params }) {

      await Promise.all(
        [
         store.dispatch('extensions/initial', 0),
         store.dispatch('extensions/balance')
         ]
      )

    },
*/

    mounted: async function() {

      if(!this.$store.getters['extensions/extensions'].length) {

        await Promise.all(
          [
          this.$store.dispatch('extensions/initial', 0),
          this.$store.dispatch('extensions/balance')
          ]
        )
      }
      
      this.initialising = false;
    },

    computed: {
      // ...mapGetters('questions', ['questions'])
      extensions() {
        return this.$store.getters['extensions/extensions']
      },

      balance() {
        return this.$store.getters['extensions/balance']
      }
    },

    methods: {
      // ...mapGetters('questions', ['questions'])
      async load() {
        this.loading = true
        await this.$store.dispatch('extensions/load', this.$store.getters['extensions/extensions'].length)
        this.loading = false
      }

    },

  }

</script>