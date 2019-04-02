<template>
<div>
    <!-- 出品 & 金額変更 -->
    <transition name="modal" v-if="modalNo == 1">
      <div class="l-modal">
        <div class="l-modal__frame">
          <div class="l-modal__icon">
            <img src="~/assets/img/modal/icon.svg" alt="" />
          </div>
          <div class="l-modal__title">{{$t('modal.sell')}}</div>
          <div class="l-modal__og">
              <img :src="ogp" alt="" width="85%" />
          </div>
          <div class="l-modal__txt">{{$t('modal.postOnSocialMedia')}}</div>
          <div class="l-modal__btn">
            <a
              :href="
                'https://twitter.com/share?url=' +
                  host + type.symbol +
                  '/order/' +
                  hash +
                  '&text=' +
                  'NOW ON SALE!! ' +
                  ' / Id.' +
                  asset.id +
                  ' / Gen.' +
                  asset.generation +
                  ' / ' +
                  asset.status.cooldown_index_to_speed +
                  ' / from @bazaaario' +
                  '&hashtags=bazaaar, バザー, ' +
                  type.name
              "
              class="twitter-share-button"
              data-size="large"
              data-show-count="false"
              target="”_blank”"
            >
              {{$t('modal.tweet')}}
            </a>
          </div>
          <div class="l-modal__close" @click="$emit('transitionOrder')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">{{$t('modal.close')}}</div>
          </div>
        </div>
      </div>
    </transition>
    <!--  approve -->
    <transition name="modal" v-else-if="modalNo == 2">
      <div class="l-modal">
        <div class="l-modal__frame">
          <div class="l-modal__icon">
            <img src="~/assets/img/modal/icon.svg" alt="" />
          </div>

          <div class="l-modal__title">{{$t('modal.approveProcessStarted')}}</div>
          <div class="l-modal__txt">{{$t('modal.announce')}}</div>
          <div class="l-modal__og">
            <div id="modalImg">
              <img :src="asset.image_url" alt=""  />
            </div>
          </div>
          <div class="l-modal__txt1">{{$t('modal.transaction')}}</div>
            <div class="l-modal__txt">
               <a :href="'https://etherscan.io/tx/' + hash" target="_blank">Ethescan</a>
            </div>
          <div class="l-modal__txt1">{{$t('modal.approve')}}</div>
          <div class="l-modal__close" @click="$emit('closeModal')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">{{$t('modal.close')}}</div>
          </div>
        </div>
      </div>
    </transition>

    <!-- キャンセル -->
    <transition name="modal" v-else-if="modalNo == 3">
      <div class="l-modal">
        <div class="l-modal__frame">
          <div class="l-modal__icon">
            <img src="~/assets/img/modal/icon.svg" alt="" />
          </div>
          <div class="l-modal__title">{{$t('modal.cancel')}}</div>
          <div class="l-modal__og">
             <div id="modalImg">
              <img :src="asset.image_url" alt=""  />
             </div>
          </div>
          <div class="l-modal__txt1">{{$t('modal.transaction')}}</div>
            <div class="l-modal__txt">
               <a :href="'https://etherscan.io/tx/' + hash" target="_blank">Ethescan</a>
            </div>
          <div class="l-modal__close" @click="$emit('transitionTop')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">{{$t('modal.close')}}</div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 購入 -->
    <transition name="modal" v-else-if="modalNo == 4">
    <div class="l-modal">
        <div class="l-modal__frame">
            <div class="l-modal__icon"><img src="~/assets/img/modal/icon.svg" alt=""></div>
            <div class="l-modal__title">{{$t('modal.purchase')}}</div>
            <div class="l-modal__og">
                <div id="modalImg">
                    <img  :src="order.metadata.image_url" alt="">
                </div>
            </div>
            <div class="l-modal__txt1">{{$t('modal.transaction')}}</div>
            <div class="l-modal__txt">
              <a :href="'https://etherscan.io/tx/' + hash" target="_blank">Ethescan</a>
            </div>
            <div class="l-modal__txt1">{{$t('modal.mypage')}}</div>
            <p ></p>
            <div class="l-modal__close" @click="$emit('transitionTop')">
                <div class="l-modal__close__icon" ></div>
                <div class="l-modal__close__txt u-obj--sp">{{$t('modal.close')}}</div>
            </div>
        </div>
        </div>
    </transition>
    <!-- OGP描画中のローディング -->
    <transition name="modal" v-else-if="modalNo == 5">
      <div class="l-modal">
        <div class="l-modal__frame loading">
              <img src="~/assets/img/modal/loading.gif" width="50%" alt="">
        </div>
      </div>
    </transition>
    <!-- Metamask等おすすめ画面 -->
    <transition name="modal" v-else-if="modalNo == 6">
      <div class="l-modal">
        <div class="l-modal__frame">
          <div class="l-modal__icon"><img src="~/assets/img/modal/icon.svg" alt=""></div>
            <div class="l-modal__title">{{$t('modal.error')}}</div>
            <div class="l-modal__txt">{{$t('modal.error2')}}</div>
            <div class="l-modal__og">
             <v-container grid-list-md align-center justify-space-between>
                <v-layout row wrap justify-center>
                  <v-flex xs4 sm3>
                    <a href="https://metamask.io/" target="_blank">
                        <v-card class="partner pa-3">
                            <v-img
                            v-bind:src="require('~/assets/img/modal/metamask.jpeg')"
                            aspect-ratio="1"
                            ></v-img>
                        </v-card>
                    </a>
                    </v-flex>
                    <v-flex xs4 sm3>
                    <a :href="'https://tokenpocket.github.io/applink?dappUrl=https://bazaaar.io/'+ url.type + '/order/' + url.hash"  target="_blank">
                        <v-card class="partner pa-3">
                            <v-img
                            v-bind:src="require('~/assets/img/partner/tokenpocket.png')"
                            aspect-ratio="1"
                            ></v-img>
                        </v-card>
                    </a>
                    </v-flex>
                    <v-flex xs4 sm3>
                    <a href="https://www.go-wallet.app/" target="_blank">
                        <v-card class="partner pa-3">
                            <v-img
                            v-bind:src="require('~/assets/img/partner/GoWallet.png')"
                            aspect-ratio="1"
                            ></v-img>
                        </v-card>
                    </a>
                    </v-flex>
                </v-layout>
            </v-container>
            </div>
            <p ></p>
            <div class="l-modal__close" @click="$emit('transitionTop')">
                <div class="l-modal__close__icon" ></div>
                <div class="l-modal__close__txt u-obj--sp">{{$t('modal.close')}}</div>
            </div>
        </div>
      </div>
    </transition>
</div>
</template>

<script>
export default {
    props: ['ogp','asset','hash','modalNo', 'host', 'url'],
    computed: {
    order() {
      return this.$store.getters['order/order']
    },
  },
}
</script>

<style scoped>
.twitter-share-button {
  text-decoration: none;
  color: white;
}

.white_text {
  color: white;
}

.loading{
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-box{
  margin: auto;
}

</style>
