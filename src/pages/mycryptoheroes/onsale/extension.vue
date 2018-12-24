
<template>
  <v-layout>
    <v-layout row wrap>
      <v-flex xs6 sm4 lg2 v-for="(item,i) in items" :key="i">
          <v-card class="rounded ma-2" :to="'../detail/extension/' + item.attributes.id">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{item.attributes.rarity}}</div>
                <span class="grey--text">Lv. {{item.attributes.lv}}</span>
              </div>
            </v-card-title>
            <v-card-text><img v-bind:src="item.image" width="100%" alt=""></v-card-text>
            <v-card-text>{{item.attributes.extension_name}}</v-card-text>
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
        items: [{"name":"MCH Extension: #30020200 Lv.68","description":"ExtensionName: Brave Musket\nNickname: Brave Musket","image":"https://www.mycryptoheroes.net/images/extensions/2000/3002.png","attributes":{"active_skill":"Brave Shots","agi":26,"extension_name":"Brave Musket","hp":3,"int":77,"lv":68,"phy":1,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/extensions/30020200","image_url":"https://www.mycryptoheroes.net/images/extensions/2000/3002.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Extension: #30010296 Lv.64","description":"ExtensionName: Brave Blade\nNickname: ","image":"https://www.mycryptoheroes.net/images/extensions/2000/3001.png","attributes":{"active_skill":"Brave Slash","agi":0,"extension_name":"Brave Blade","hp":75,"int":0,"lv":64,"phy":74,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/extensions/30010296","image_url":"https://www.mycryptoheroes.net/images/extensions/2000/3001.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Extension: #30040692 Lv.1","description":"ExtensionName: Brave Armor\nNickname: ","image":"https://www.mycryptoheroes.net/images/extensions/2000/3004.png","attributes":{"active_skill":"Brave Protection","agi":0,"extension_name":"Brave Armor","hp":81,"int":0,"lv":1,"phy":9,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/extensions/30040692","image_url":"https://www.mycryptoheroes.net/images/extensions/2000/3004.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Extension: #30040749 Lv.1","description":"ExtensionName: Brave Armor\nNickname: ","image":"https://www.mycryptoheroes.net/images/extensions/2000/3004.png","attributes":{"active_skill":"Brave Protection","agi":0,"extension_name":"Brave Armor","hp":81,"int":0,"lv":1,"phy":9,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/extensions/30040749","image_url":"https://www.mycryptoheroes.net/images/extensions/2000/3004.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Extension: #30020376 Lv.53","description":"ExtensionName: Brave Musket\nNickname: ","image":"https://www.mycryptoheroes.net/images/extensions/2000/3002.png","attributes":{"active_skill":"Brave Shots","agi":22,"extension_name":"Brave Musket","hp":0,"int":66,"lv":53,"phy":0,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/extensions/30020376","image_url":"https://www.mycryptoheroes.net/images/extensions/2000/3002.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Extension: #30040662 Lv.1","description":"ExtensionName: Brave Armor\nNickname: ","image":"https://www.mycryptoheroes.net/images/extensions/2000/3004.png","attributes":{"active_skill":"Brave Protection","agi":0,"extension_name":"Brave Armor","hp":81,"int":0,"lv":1,"phy":9,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/extensions/30040662","image_url":"https://www.mycryptoheroes.net/images/extensions/2000/3004.png","home_url":"https://www.mycryptoheroes.net"}]
      }
    },

  }

</script>