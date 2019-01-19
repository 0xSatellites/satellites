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

export default {

  data() {
    return {

    }
  },

  components: {

  }
}
</script>
