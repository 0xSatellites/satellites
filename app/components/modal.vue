<template>
<div>
    <!-- 出品 & 金額変更 -->
    <transition name="modal" v-if="modalNo == 1">
      <div class="l-modal">
        <div class="l-modal__frame">
          <div class="l-modal__icon">
            <img src="~/assets/img/modal/icon.svg" alt="" />
          </div>
          <div class="l-modal__title">{{$t('model.sell')}}</div>
          <div class="l-modal__og">
            <div id="modalImg">
              <img :src="ogp" alt="" width="85%" />
            </div>
          </div>
          <div class="l-modal__txt">{{$t('model.postOnSocialMedia')}}</div>
          <div class="l-modal__btn">
            <a
              :href="
                'https://twitter.com/share?url=' +
                  host +
                  'ck/order/' +
                  hash +
                  '&text=' +
                  'NOW ON SALE!! ' +
                  ' / Id.' +
                  asset.id +
                  ' / Gen.' +
                  asset.generation +
                  ' / ' +
                  coolDownIndex +
                  ' / from @bazaaario' +
                  '&hashtags=bazaaar, バザー, CryptoKitties'
              "
              class="twitter-share-button"
              data-size="large"
              data-show-count="false"
              target="”_blank”"
            >
              {{$t('model.tweet')}}
            </a>
          </div>
          <div class="l-modal__close" @click="$emit('transitionOrder')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">{{$t('model.close')}}</div>
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
          <div class="l-modal__title">{{$t('model.approveProcessStarted')}}</div>
          <div class="l-modal__og">
            <div id="modalImg">
              <img :src="asset.image_url" alt="" width="50%" />
            </div>
          </div>
          <div class="l-modal__txt1">{{$t('model.transaction')}}</div>
            <div class="l-modal__txt">
               <a :href="'https://etherscan.io/tx/' + hash">Ethescan</a>
            </div>
            <div class="l-modal__txt1">{{$t('model.before')}}</div>
          <div class="l-modal__close" @click="$emit('closeModal')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">{{$t('model.close')}}</div>
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
          <div class="l-modal__title">{{$t('model.cancel')}}</div>
          <div class="l-modal__og">
            <div id="modalImg">
              <img :src="asset.image_url" alt="" width="50%" />
            </div>
          </div>
          <div class="l-modal__txt1">{{$t('model.transaction')}}</div>
            <div class="l-modal__txt">
               <a :href="'https://etherscan.io/tx/' + hash">Ethescan</a>
              </div>
          <div class="l-modal__close" @click="$emit('transitionTop')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">{{$t('model.close')}}</div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 購入 -->
    <transition name="modal" v-else-if="modalNo == 4">
    <div class="l-modal">
        <div class="l-modal__frame">
            <div class="l-modal__icon"><img src="~/assets/img/modal/icon.svg" alt=""></div>
            <div class="l-modal__title">{{$t('model.purchase')}}</div>
            <div class="l-modal__og">
                <div id="modalImg">
                    <img  :src="order.metadata.image_url" alt=""  width="50%">
                </div>
            </div>
            <div class="l-modal__txt1">{{$t('model.transaction')}}</div>
            <div class="l-modal__txt">
              <a :href="'https://etherscan.io/tx/' + hash">Ethescan</a>
            </div>
            <div class="l-modal__txt1">{{$t('model.mypage')}}</div>
            <p ></p>
            <div class="l-modal__close" @click="$emit('transitionTop')">
                <div class="l-modal__close__icon" ></div>
                <div class="l-modal__close__txt u-obj--sp">{{$t('model.close')}}</div>
            </div>
        </div>
        </div>
    </transition>
</div>
</template>

<script>
export default {
    props: ['ogp','asset','hash','modalNo', 'host', 'coolDownIndex'],
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
</style>
