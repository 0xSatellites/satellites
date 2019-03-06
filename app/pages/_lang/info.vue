<template>
<v-content>
    <v-container>
        <v-card-text color="teal">
            <div class="display-1 text-md-center">Information</div>
            <div class="info__news">
                <div class="info__news__item">
                    <p class="info__news__item__datetime">2019.03.01</p>
                    <a href="https://harukataro.com/bazaaar/" class="info__news__item__title">ブロックチェーンブロガーのはるかさんにbazaaar.ioの使い方を記事にしていただきました！</a>
                </div>
                <div class="info__news__item">
                    <p class="info__news__item__datetime">2019.03.01</p>
                    <a href="https://dappsmarket.net/other/bazaaar-io-howtoplay/" class="info__news__item__title">dApps marketさんにbazaaar.ioの使い方を記事にしていただきました！</a>
                </div>
            </div>
        </v-card-text>
    </v-container>
</v-content>
</template>

<script>
</script>

<style scoped>
    .info__news {
    transform: translateY(-10rem);
    background-color: #fff;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.04);
    padding: 3rem;
    width: 100%;
    position: relative;
    margin-top: 10rem;
    }

    .info__news__item{
        margin-bottom: 2rem;
        z-index: 10000;
        position: relative;
    }

    .info__news__item__datetime{
        margin: 0;
        font-size: .6rem;
        margin-bottom: .5rem;
    }

    .info__news__item__title{
        margin: 0;
        font-size: 1rem;
        color: black;
    }
</style>