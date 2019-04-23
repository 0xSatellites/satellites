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
                    <v-divider　v-if = "index < 3"></v-divider>
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
            avatar: 'https://pbs.twimg.com/profile_images/1061999767092248576/ixq60QaF_400x400.jpg',
            date: '2019.04.22',
            title: "キヨスイさんにbazaaar.ioの使い方をYouTube動画にしていただきました！",
            url: 'https://www.youtube.com/watch?v=3yXrjUkjuRM'
          },
          {
            avatar: 'https://dappsmarket.net/wp-content/themes/dappsmarket2/images/prof.png',
            date: '2019.04.20',
            title: "はるかさんのマイクリ出品情報サイトに、bazaaarの出品情報対応をしていただきました！",
            url: 'https://twitter.com/harukatarotaro/status/1119518736866627584'
          },
          {
            avatar: 'https://pbs.twimg.com/profile_images/1113612866236477440/j_QyVBiS_400x400.png',
            date: '2019.04.20',
            title: "マイクリハッカソンに出場しました！コミュニティ投票よろしくお願いします",
            url: 'https://docs.google.com/presentation/d/1GZ5CyU-zBBnGMPZBqxHm4bzEE-C1HzP5K9I-g4Fl24Y/edit?usp=sharing'
          },
          {
            avatar: 'https://pbs.twimg.com/profile_images/1113612866236477440/j_QyVBiS_400x400.png',
            date: '2019.04.19',
            title: "bazaaar.ioのロードマップを公開しました",
            url: 'https://medium.com/blockbase/bazaaar-initial-loadmap-ecebfa8b43d5'
          },
          {
            avatar: 'https://cdn.profile-image.st-hatena.com/users/sencho0927/profile.png?1520144457',
            date: '2019.04.16',
            title: "fukuharaさんにbazaaar.ioの使い方を記事にしていただきました！",
            url: 'https://www.fukuhara-sencho.com/entry/2019/04/04/102916'
          },
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
          },
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