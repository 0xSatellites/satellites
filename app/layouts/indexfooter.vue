<template>
  <div>
    <header-temp></header-temp>
    <nuxt />
    <div class="l-footer">
        <div class="l-footer__links">

          <div>
          <div class="l-footer__title">SNSマーケット</div>
          <div class="l-footer__item">- <a href="https://twitter.com/bazaaario" target="_blank">twitter</a></div>
          <div class="l-footer__item">- <a href="https://block-base.co/" target="_blank">Discord</a></div>
          </div>

          <div>
          <div class="l-footer__title">取り扱いアセット</div>
          <div class="l-footer__item">- <a href="https://www.mycryptoheroes.net/ja" target="_blank">My Crypt Hero</a></div>
          <div class="l-footer__item">- <a href="https://www.cryptokitties.co/" target="_blank">CryptoKitties</a><span class="l-footer__note">※coming soon</span></div>
          <div class="l-footer__item">- <a href="https://www.crypt-oink.io/?lang=jp" target="_blank">Crypton</a><span class="l-footer__note">※coming soon</span></div>
          </div>

          <div>
          <div class="l-footer__title">パートナー</div>
          <div class="l-footer__item">- <a href="https://tokenpocket.jp/ja/">tokenpocket</a></div>
          <div class="l-footer__item">- <a href="https://www.go-wallet.app/">go-wallet</a></div>
          <div class="l-footer__item">- <a href="https://www.mycryptoheroes.net/ja">mycryptoheroes</a></div>
          </div>
      </div>
       <div class="l-footer__company">
          <small>&copy; 2019 BlockBase Co.,Ltd.</small>
          <div><a href="/terms">利用規約</a>｜<a href="https://block-base.co/" target="_blank">運営会社</a></div>
        </div>
    </div>
  </div>
</template>
<script>
import HeaderTemp from '~/components/header'

export default {
  components: {
    HeaderTemp,
  },
}
</script>
<style>
</style>
