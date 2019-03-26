<template>
<v-content>
    <v-card-text color="teal">
    <div class="display-1 text-md-center pa-3">Information</div>
        <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
            <v-card flat>
                <v-divider></v-divider>
                <template v-for="(item, index) in items">

                    <v-divider
                    v-if="item.divider"
                    :key="index"
                    ></v-divider>

                    <v-card
                    flat
                    v-else
                    :key="item.title"
                    avatar
                    :href="item.url"
                    target="_blank"
                    class="news__item"
                    >
                    <v-list-tile-avatar class="news__item__avatar">
                        <img :src="item.avatar">
                    </v-list-tile-avatar>
                    <div class="news__item__text">
                        <div class="news__date">{{item.date}}</div>
                        <div>{{item.title}}</div>
                    </div>
                    </v-card>
                </template>
                <v-divider></v-divider>
            </v-card>
            </v-flex>
        </v-layout>
    </v-card-text>
</v-content>
</template>

<script>
export default {
    data () {
      return {
        items: [
          {
            avatar: 'https://harukataro.com/wp-content/uploads/2018/08/inu-1-150x150.png',
            date: '2019.03.01',
            title: "ブロックチェーンブロガーのはるかさんにbazaaar.ioの使い方を記事にしていただきました！",
            url:'https://harukataro.com/bazaaar/'
          },
          { divider: true, inset: true },
          {
            avatar: 'https://dappsmarket.net/wp-content/themes/dappsmarket2/images/prof.png',
            date: '2019.03.01',
            title: "dApps marketさんにbazaaar.ioの使い方を記事にしていただきました！",
            url: 'https://dappsmarket.net/other/bazaaar-io-howtoplay/'
          },
        ]
      }
    },
  }
</script>

<style scoped>
.news__date{
    color:grey;
    font-size:0.9em;
}

.news__item{
    padding: 0 16px;
    display: flex;
}

.news__item__avatar{
    min-width: 56px;
    align-items: center;
}

.news__item__text{
    padding: 20px 0;
}
</style>