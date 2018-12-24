
<template>
  <v-layout>
    <v-layout row wrap>
      <v-flex xs6 md2 v-for="(item,i) in heroes" :key="i">
          <v-card class="rounded ma-2" :to="'../detail/hero/' + item.attributes.id">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{item.attributes.rarity}}</div>
                <span class="grey--text">Lv. {{item.attributes.lv}}</span>
              </div>
            </v-card-title>
            <v-card-text><img v-bind:src="item.image" width="100%" alt=""></v-card-text>
            <v-card-text>{{item.attributes.hero_name}}</v-card-text>
          </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>

  import axios from 'axios'

  export default {
    data() {
      return {
        heroes: [{"name":"MCH Hero: #30040157 Lv.1","description":"HeroName: Mata Hari","image":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","attributes":{"active_skill":"Rest","agi":20,"hero_name":"Mata Hari","hp":45,"id":30040157,"int":19,"lv":1,"passive_skill":"Eye of the day","phy":14,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30040157","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #30050132 Lv.1","description":"HeroName: ETHEREMON-BLUE","image":"https://www.mycryptoheroes.net/images/heroes/2000/3005.png","attributes":{"active_skill":"Rest","agi":17,"hero_name":"ETHEREMON-BLUE","hp":57,"id":30050132,"int":19,"lv":1,"passive_skill":"Omnom Tactics","phy":13,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30050132","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3005.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #20020031 Lv.1","description":"HeroName: Spartacus","image":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","attributes":{"active_skill":"Rest","agi":12,"hero_name":"Spartacus","hp":63,"id":20020031,"int":12,"lv":1,"passive_skill":"Gladiator War","phy":13,"rarity":"Uncommon"},"external_url":"https://www.mycryptoheroes.net/heroes/20020031","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #20020353 Lv.3","description":"HeroName: Spartacus","image":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","attributes":{"active_skill":"Rest","agi":13,"hero_name":"Spartacus","hp":78,"id":20020353,"int":13,"lv":3,"passive_skill":"Gladiator War","phy":14,"rarity":"Uncommon"},"external_url":"https://www.mycryptoheroes.net/heroes/20020353","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","home_url":"https://www.mycryptoheroes.net"}],
      }
    },


  }

</script>
