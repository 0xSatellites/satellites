<template>
<v-content>
    <v-card-text color="teal">
        <v-layout row>
            <v-flex xs12 sm8 offset-sm2>
            <v-card flat v-if="bool">
                <v-divider></v-divider>
                <template v-for="item in items">
                    <v-card
                    flat
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
                    <v-divider></v-divider>
                </template>
            </v-card>
            <v-card flat v-else>
                <v-divider></v-divider>
                <template v-for="(item, index) in items">
                    <v-card
                    v-if = "index < 3"
                    flat
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
                    <v-divider></v-divider>
                </template>
            </v-card>
            </v-flex>
        </v-layout>
    </v-card-text>
</v-content>
</template>

<script>
export default {
    data(){
    return {
      count: [0,1,2],
      bool: true,
      items: [
          {
            avatar: 'https://harukataro.com/wp-content/uploads/2018/08/inu-1-150x150.png',
            date: '2019.03.01',
            title: "ブロックチェーンブロガーのはるかさんにbazaaar.ioの使い方を記事にしていただきました！",
            url:'https://harukataro.com/bazaaar/'
          },
          {
            avatar: 'https://dappsmarket.net/wp-content/themes/dappsmarket2/images/prof.png',
            date: '2019.03.01',
            title: "dApps marketさんにbazaaar.ioの使い方を記事にしていただきました！",
            url: 'https://dappsmarket.net/other/bazaaar-io-howtoplay/'
          }
        ]
    }
  },
  mounted: function() {
    const url = this.$nuxt.$route.path
    if(url.indexOf('info') != -1) {
        this.bool = true
    }else {
        this.bool = false
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