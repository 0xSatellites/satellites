<template>
<div>
    <section class="l-visual">
        <div class="l-visual__bg"><img src="~/assets/img/top_visual/bg_pc.png" alt="" class="u-obj--pc"><img src="~/assets/img/top_visual/bg_sp.png" alt="" class="u-obj--sp"></div>

        <div class="l-visual__txts">
        <h1 class="l-visual__txts__title"><img src="~/assets/img/top_visual/title_pc.png" alt="誰でもカンタン デジタルアセットの取引マッチングサービス - bazaaar.io" class="u-obj--pc"><img src="~/assets/img/top_visual/title_sp.png" alt="" class="u-obj--sp"></h1>
        </div>

        <div class="l-visual__img"><img src="~/assets/img/top_visual/illust.png" alt=""></div>

        <div class="l-about">
        <ul>
        <li>
        <h2 class="l-about__title">{{ $t('index.subTitle1') }}</h2>
        <p class="l-about__txt">{{ $t('index.subDiscription1') }}</p>
        </li>
        <li>
        <h2 class="l-about__title">{{ $t('index.subTitle2') }}</h2>
        <p class="l-about__txt">{{ $t('index.subDiscription2') }}</p>
        </li>
        <li>
        <h2 class="l-about__title">{{ $t('index.subTitle3') }}</h2>
        <p class="l-about__txt">{{ $t('index.subDiscription3') }}</p>
        </li>
        </ul>
        </div>
    </section>
    <section class="c-index c-index--recommend">

        <h2 class="c-index__title">{{ $t('index.newAssets') }}</h2>
        <ul>
        <li>
        <a href="#" class="c-card">
        <div class="c-card__label c-card__label__rarity--1">★1</div>
        <div class="c-card__img"><img src="~/assets/img/card/sample_img.png" alt=""></div>
        <div class="c-card__name">Masamune Date / LV.99</div>
        <div class="c-card__txt">#30010206</div>
        <div class="c-card__txt">My Crypto Heores</div>
        <div class="c-card__eth">Ξ 0.45</div>
        </a>
        </li>
        <li>
        <a href="#" class="c-card">
        <div class="c-card__label c-card__label__rarity--2">★2</div>
        <div class="c-card__img"><img src="~/assets/img/card/sample_img.png" alt=""></div>
        <div class="c-card__name">Masamune Date / LV.99</div>
        <div class="c-card__txt">#30010206</div>
        <div class="c-card__txt">My Crypto Heores</div>
        <div class="c-card__eth">Ξ 0.45</div>
        </a>
        </li>
        <li>
        <a href="#" class="c-card">
        <div class="c-card__label c-card__label__rarity--3">★3</div>
        <div class="c-card__img"><img src="~/assets/img/card/sample_img.png" alt=""></div>
        <div class="c-card__name">Masamune Date / LV.99</div>
        <div class="c-card__txt">#30010206</div>
        <div class="c-card__txt">My Crypto Heores</div>
        <div class="c-card__eth">Ξ 0.45</div>
        </a>
        </li>
        <li>
        <a href="#" class="c-card">
        <div class="c-card__label c-card__label__rarity--4">★4</div>
        <div class="c-card__img"><img src="~/assets/img/card/sample_img.png" alt=""></div>
        <div class="c-card__name">Masamune Date / LV.99</div>
        <div class="c-card__txt">#30010206</div>
        <div class="c-card__txt">My Crypto Heores</div>
        <div class="c-card__eth">Ξ 0.45</div>
        </a>
        </li>
        </ul>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.handlingAssets') }}</h2>
            <v-layout>
                <v-flex xs12 sm6 offset-sm3>
                <a href="https://www.cryptokitties.co/">
                    <v-card>
                        <v-img
                        v-bind:src="require('~/assets/img/original/CryptoKitties.png')"
                        aspect-ratio="1.75"
                        ></v-img>

                        <v-card-title primary-title>
                        <div class="text-box">
                            <h3 class="headline mb-0">CryptoKitties</h3>
                        </div>
                        </v-card-title>            
                    </v-card>
                </a>
                </v-flex>
            </v-layout>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.partners') }}</h2>
        <v-container grid-list-md align-center justify-space-between>
            <v-layout row wrap justify-center>
                <v-flex xs6 md3>
                <a href="https://tokenpocket.jp/ja/">
                    <v-card class="partner">
                        <v-img
                        v-bind:src="require('~/assets/img/original/tokenpocket.png')"
                        aspect-ratio="1"
                        ></v-img>

                        <v-card-title primary-title>
                        <div class="text-box">
                            <h3 class="headline mb-0">TokenPocket</h3>
                        </div>
                        </v-card-title>            
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 md3>
                <a href="https://www.go-wallet.app/">
                    <v-card class="partner">
                        <v-img
                        v-bind:src="require('~/assets/img/original/GoWallet.png')"
                        aspect-ratio="1"
                        ></v-img>

                        <v-card-title primary-title>
                        <div class="text-box">
                            <h3 class="headline mb-0">GO!WALLET</h3>
                        </div>
                        </v-card-title>            
                    </v-card>
                </a>
                </v-flex>
            </v-layout>
        </v-container>    
    </section>
</div>
</template>

<script>

export default {

head() {
    return { title: this.$t('meta.titile') }
  }

}

</script>

<style scope>
    .text-box{
        margin: auto;
    }

    a{
        text-decoration: none
    }

    .partner{
        margin-right: 1em;
    }
</style>
