<template>
<section class="l-information">
    <div class="l-information__img">
      <img class="ogpimg" src="~/assets/img/maltine/maltinelogo.png" />
    </div>
    <br>
    <h2 class="c-index__title">NEW MUSIC</h2>
    <div class="l-item__frame">
        <div>
          <div class="l-item__img">
            <img src="~/assets/img/maltine/AcidAcid_1024.png"/>
          </div>
        </div>
        <div class="l-item-frame">
          <div class="l-item__name">ACID ACID EP</div>
          <div class="l-item__txt">Artist: Mitaka Sound</div>
          <br>
          <div class="l-item__txt2">TrackList / TokenList: </div>
          <div class="l-item__txt2">ACID ACID EP Vol.1 / ACID ACID (さよひめぼう Remix) / Mitaka Sound </div>
          <div class="l-item__txt2">ACID ACID EP Vol.2 / ACID ACID / Mitaka Sound </div>
          <div class="l-item__txt2">ACID ACID EP Vol.3 / ACID ACID (Gassyoh Remix) / Mitaka Sound </div>
          <div class="l-item__txt2">ACID ACID EP Vol.4 / ACID ACID (コバルト爆弾αΩ Remix) / Mitaka Sound </div>
          <br>
          <div class="l-item__txt2">Label: Maltine Records</div>
          <div class="l-item__txt2">Producer: Cobalt Bomb Alpha Omega</div>
          <div class="l-item__txt2">Artwork: NC Empire</div>
          <div class="l-item__txt2">Mastering Enginner: Tatsuya Shiozawa</div>
          <div class="l-item__txt2">Contract Design: BlockBase,Inc</div>
          <div class="l-item__txt2">Executive Producer: tomad</div>
          <br>
          <div>
            <v-list two-line>
              <template v-for="item in items">
                <v-subheader
                  v-if="item.header"
                  :key="item.header"
                >
                  {{ item.header }}
                </v-subheader>
                <v-list-tile
                  v-else
                  :key="item.userId"
                  avatar
                >
                  <v-list-tile-avatar>
                    <img :src="item.avatar">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title ><a :href="'https://twitter.com/' + item.userId">{{ item.userId }}</a>- {{ item.track_title}}</v-list-tile-title>
                    <v-list-tile-sub-title >{{ item.address }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </div>
          <br>
          <br>
          <div class="l-item__txt2">Sample Music</div>
          <audio src="@/assets/img/maltine/Sample.mp3" controls></audio>
           <br>
           <br>
          <div class="l-item__txt2">
            インターネット上で無償配布される予定のmp3音源ファイルに関するレコード製作者の権利（以下、原盤権）の一部(※1)をトークン化しました。<br>
            原盤権は一般的にレコード会社が保有しているものですが、今回4つのMP3ファイル1つ1つを原盤としてとらえ、ブロックチェーンで権利関係を明示したトークンとする事で、NFTのマッチングプラットフォーム“bazaaar”での権利移転が可能となりました。<br>
            また、著作者の権利の一部である翻案権・演奏権がトークン保有により無条件に許諾されることがトークン内に明記されており、トークン保持者は著作者や管理団体に対してその都度使用許諾を得ることなく、これらの権利を行使することができます。<br>
            つまり、トークン保有者はMP3音源のコピー、配布、Remix、カバー演奏がレコード制作者や著作者にその都度許可を得ることなく自由に行えます(※2)。<br>
            <br>
            また今回のトークンの入手には、下記の応募フォームからの抽選への応募が必要となります。<br>
            抽選は本企画の趣旨に沿い、BlockBase株式会社、Maltine Records、コバルト爆弾αΩにて行います。<br>
            <br>
            ※1 原盤権の一部：複製権・譲渡権。原盤権の複製権・譲渡権を行使すれば、マスタリング済の音源パッケージ（原盤）を使って新たな音源(CD/レコード)をリリースできます。<br>
            ※2 想定される例<br>
            ・コンピレーションアルバムを作成し、CDリリース。<br>
            ・新たに作成したRemixをレコード化し、リリース。<br>
            ・ストリーミングサイトでの公開や音源直販サイトでの販売。<br>
            ※3 抽選は終了しました。<br>
            <br>

          </div>
          <div class="l-item__txt2">
          また原盤権が付与されないMP3ファイルは、別途無償にて配布を行います。
          </div>
          <a class="l-item__txt2" :href="'http://maltinerecords.cs8.biz/b1.html'" target="_blank">Maltine Records Link</a>

          <br>
      </div>
    </div>
</section>
</template>

<script>

export default {
  data () {
      return {
        items: [
          { header: 'TokenHolder' },
          {
            avatar: 'https://pbs.twimg.com/profile_images/1127239081417531393/chTncmIG_400x400.png',
            userId: 'pianoid',
            track_title:'ACID ACID (さよひめぼう Remix)',
            address: "0x93B82487D468A6b85f0759D86bDdC6ECC33A349E"
          },
          {
            avatar: 'https://pbs.twimg.com/profile_images/953996596559032320/bQcnZPLW_400x400.jpg',
            userId: 'fugakura',
            track_title:'ACID ACID',
            address: "0x568288D40EB4887446fBbFFF879F2184E91827d3"
          },
          {
            avatar: 'https://pbs.twimg.com/profile_images/506240121423683584/2HFnycx7_400x400.jpeg',
            userId: 'mikiomurahatibu',
            track_title:'ACID ACID (Gassyoh Remix)',
            address: "0x43A0E71A09d8126820C3290d71A5514e87D617ab"
          },
          {
            avatar: 'https://pbs.twimg.com/profile_images/927851243422097408/tL9fwfVr_400x400.jpg',
            userId: 'Sheep_Musik',
            track_title:'ACID ACID (コバルト爆弾αΩ Remix) ',
            address: "0x8A389057B4500a881Ac58e03381109B1b2D14fb4"
          },
        ]
      }
    }

}
</script>

<style scoped>
.white_text {
  color: white;
}

.l-item-frame{
  padding: 0px 30px;
}
</style>
