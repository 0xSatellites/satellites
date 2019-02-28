<template>
<div>
    <!-- 出品 & 金額変更 -->
    <transition name="modal" v-if="modalNo == 1">
      <div class="l-modal">
        <div class="l-modal__frame">
          <div class="l-modal__icon">
            <img src="~/assets/img/modal/icon.svg" alt="" />
          </div>
          <div class="l-modal__title">出品されました！</div>
          <div class="l-modal__og">
            <div id="modalImg">
              <img :src="ogp" alt="" width="85%" />
            </div>
          </div>
          <div class="l-modal__txt">SNSに投稿しましょう</div>
          <div class="l-modal__btn">
            <a
              :href="
                'https://twitter.com/share?url=' +
                  host +
                  'ck/order/' +
                  hash +
                  '&text=' +
                  'NOW ON SALE!! ' +
                  '/ Id.' +
                  asset.id +
                  '/ Gen.' +
                  asset.generation +
                  '&hashtags=bazaaar, バザール, CryptoKitties'
              "
              class="twitter-share-button"
              data-size="large"
              data-show-count="false"
              target="”_blank”"
            >
              twitterに投稿
            </a>
          </div>
          <div class="l-modal__close" @click="$emit('transitionOrder')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">閉じる</div>
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
          <div class="l-modal__title">承認処理受付しました！</div>
          <div class="l-modal__og">
            <div id="modalImg">
              <img :src="asset.image_url" alt="" width="50%" />
            </div>
          </div>
          <div class="l-modal__txt1">トランザクション</div>
            <div class="l-modal__txt">
               <a :href="'https://etherscan.io/tx/' + hash">Ethescan</a>
            </div>
            <div class="l-modal__txt1">承認完了後、出品可能になるまで少しお時間がかかります</div>
          <div class="l-modal__close" @click="$emit('closeModal')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">閉じる</div>
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
          <div class="l-modal__title">キャンセルしました！</div>
          <div class="l-modal__og">
            <div id="modalImg">
              <img :src="asset.image_url" alt="" width="50%" />
            </div>
          </div>
          <div class="l-modal__txt1">トランザクション</div>
            <div class="l-modal__txt">
               <a :href="'https://etherscan.io/tx/' + hash">Ethescan</a>
              </div>
          <div class="l-modal__close" @click="$emit('transitionTop')">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">閉じる</div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 購入 -->
    <transition name="modal" v-else-if="modalNo == 4">
    <div class="l-modal">
        <div class="l-modal__frame">
            <div class="l-modal__icon"><img src="~/assets/img/modal/icon.svg" alt=""></div>
            <div class="l-modal__title">購入処理が完了しました！</div>
            <div class="l-modal__og">
                <div id="modalImg">
                    <img  :src="order.metadata.image_url" alt=""  width="50%">
                </div>
            </div>
            <div class="l-modal__txt1">トランザクション</div>
            <div class="l-modal__txt">
              <a :href="'https://etherscan.io/tx/' + hash">Ethescan</a>
            </div>
            <div class="l-modal__txt1">※購入完了後マイページの反映には少しお時間がかかります</div>
            <p ></p>
            <div class="l-modal__close" @click="$emit('transitionTop')">
                <div class="l-modal__close__icon" ></div>
                <div class="l-modal__close__txt u-obj--sp">閉じる</div>
            </div>
        </div>
        </div>
    </transition>
</div>
</template>

<script>
export default {
    props: ['ogp','asset','hash','modalNo', 'host'],
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
