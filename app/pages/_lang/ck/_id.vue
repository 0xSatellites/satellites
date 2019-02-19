<template>
  <div>
    <section class="l-item">
      <div class="l-item__frame">
        <div>
          <div class="l-item__img">
            <img :src="asset.image_url" alt="" />
          </div>
        </div>
        <div>
          <div class="l-item__name">Gen.{{ asset.generation }}</div>
          <div class="l-item__txt"># {{ asset.id }}</div>
          <div class="l-item__txt">
            Cooldown Index {{ asset.status.cooldown_index }}
          </div>
          <div class="l-item__txt">Crypto Kitties</div>
          <v-form>
            <div class="l-item__action">
              <div class="l-item__action__price">
                <label
                  ><input type="text" v-model="price" id="amount" /> ETH</label
                >
              </div>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <div slot="header">{{ $t('id.option') }}</div>
                  <v-card>
                    <p>{{ $t('id.inputMessage') }}</p>
                    <div>
                      <textarea name="" id="" cols="30" rows="10"></textarea>
                    </div>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <div v-if="owned">
              <div class="l-item__action__btns" v-if="!approved">
                <v-btn
                  class="l-item__action__btn"
                  :disabled="!valid || loading"
                  large
                  @click="approve"
                >
                  {{ $t('id.approve') }}
                  <v-progress-circular
                    size="16"
                    class="ma-2"
                    v-if="loading"
                    indeterminate
                  ></v-progress-circular>
                </v-btn>
              </div>
              <div class="l-item__action__btns" v-if="approved">
                <v-btn
                  class="l-item__action__btn l-item__action__btn--type1 white_text"
                  :disabled="!valid || loading || !approved"
                  color="#3498db"
                  large
                  @click="order_v1"
                >
                  {{ $t('id.sell') }}
                  <v-progress-circular
                    size="16"
                    class="ma-2"
                    v-if="loading"
                    indeterminate
                  ></v-progress-circular>
                </v-btn>
              </div>
              <v-flex center>
                <v-checkbox
                  class="center"
                  v-model="checkbox"
                  :rules="[v => !!v || '']"
                  label="利用規約に同意する"
                  required
                ></v-checkbox>
              </v-flex>
              </div>
            </div>
          </v-form>
        </div>
      </div>
    </section>
    <canvas id="ogp" width="1200" height="630" hidden></canvas>

    <transition name="modal" v-if="modal">
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
                'https://twitter.com/share?url=https://bazaaar.io/ck/order/' +
                  hash +
                  '&text=' +
                  '出品されました！ ' +
                  asset.name +
                  '/ LV.' +
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

          <div class="l-modal__close" @click="closeModal">
            <div class="l-modal__close__icon"></div>
            <div class="l-modal__close__txt u-obj--sp">閉じる</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'
import kitty from '~/plugins/kitty'

const config = require('../../../config.json')

export default {
  data() {
    return {
      modal: false,
      tokenOwner: false,
      hash: '',
      ogp: '',
      price: '',
      loading: false,
      valid: true,
      checkbox: false,
      approved: false,
      owned: false,
      owner: ''
    }
  },
  async asyncData({ store, params }) {
    const asset = await kitty.getKittyById(params.id)
    store.dispatch('asset/setAsset', asset)
  },
  mounted: async function() {
    const store = this.$store
    const params = this.$route.params

    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)

        /*
        //const order = await firestore.getLowestCostOrderByMakerId(account.address, params.id)
        const order = await firestore.getLowestCostOrderByMakerId('0xb5384D9F2dDd0AD646919c2299B7C9296208eB4a', '1078')
        console.log(order)
        order.sort((a, b) => {
          if (a.timestamp < b.timestamp) return 1
          if (a.timestamp > b.timestamp) return -1
          return 0
        })
        const order1 = order.shift()
        console.log(order1)
        this.price = order1.price / 1000000000000000000
        await store.dispatch('order/setOrder', order1)
        */
      }

      client.contract.ck.methods.kittyIndexToOwner(params.id).call().then(owner => {
        this.owned = owner == this.account.address
      })

      client.contract.ck.methods.kittyIndexToApproved(params.id).call().then(approvedAddress => {
        this.approved = approvedAddress == client.contract.bazaaar_v1.options.address
      })

    }
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    asset() {
      return this.$store.getters['asset/asset']
    },
    order() {
      return this.$store.getters['order/order']
    }
  },
  methods: {
    openModal() {
      this.modal = true
    },
    closeModal() {
      const router = this.$router
      this.modal = false
      router.push({ path: '/ck/order/' + this.hash })
    },
    async order_v1() {
      console.log('order_v1')
      this.loading = true
      const account = this.account
      const asset = this.asset.ck
      const params = this.$route.params
      const router = this.$router
      const amount = this.price
      const wei = client.utils.toWei(amount)
      //
      const approved = await client.contract.ck.methods
        .kittyIndexToApproved('269')
        .call()
      console.log(params.id)
      console.log(approved)
      console.log(client.contract.bazaaar_v1.options.address)

      if (approved == client.contract.bazaaar_v1.options.address) {
        console.log('approved')
        const nonce = await client.contract.bazaaar_v1.methods
          .nonce_(
            account.address,
            client.contract.ck.options.address,
            params.id
          )
          .call({ from: account.address })
        const salt = Math.floor(Math.random() * 1000000000)
        const date = new Date()
        date.setDate(date.getDate() + 7)
        const expiration = Math.round(date.getTime() / 1000)
        const order = {
          proxy: client.contract.bazaaar_v1.options.address,
          maker: account.address,
          taker: config.constant.nulladdress,
          creatorRoyaltyRecipient: account.address,
          asset: client.contract.ck.options.address,
          id: params.id,
          price: wei,
          nonce: nonce,
          salt: salt,
          expiration: expiration,
          creatorRoyaltyRatio: 0,
          referralRatio: 0
        }
        const signedOrder = await client.signOrder(order)
        var result = await functions.call('order', signedOrder)
        this.hash = result.hash
        this.ogp = result.ogp
        this.loading = false
        this.modal = true
      }
    },
    async approve() {
      const account = this.account
      const params = this.$route.params
      client.contract.ck.methods
        .approve(client.contract.bazaaar_v1.options.address, params.id)
        .send({ from: account.address })
        .on('transactionHash', function(hash) {
          console.log(hash)
        })
    },
    async cancel() {
      const account = this.account
      const order = this.order
      console.log(order)
      await client.contract.bazaaar_v1.methods
        .orderCancell_(
          [
            order.proxy,
            order.maker,
            order.taker,
            order.creatorRoyaltyRecipient,
            order.asset
          ],
          [
            order.id,
            order.price,
            order.nonce,
            order.salt,
            order.expiration,
            order.creatorRoyaltyRatio,
            order.referralRatio
          ]
        )
        .send({ from: account.address })
        .on('transactionHash', function(hash) {
          console.log(hash)
        })
    }
  }
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
