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
          <div class="l-item__name">{{ asset.name.substring(0,25) }}</div>
          <div class="l-item__txt"># {{ asset.id }}</div>
          <div class="l-item__txt">
            CryptoKitties
          </div>
          <ul class="l-item__data">
          <li><span class="l-item__rarity l-item__rarity--5" v-for="(i) in getRarity(asset)" :key="i + '-rarity'">★</span></li>
          </ul>
          <ul class="l-item__data">
          <li><strong>Gen：</strong> {{asset.generation}} </li>
          <li><strong>Cooldown：</strong> {{coolDownIndexToSpeed(asset.status.cooldown_index)}}</li>
          </ul>

          <v-form>
            <div class="l-item__action">
              <div class="l-item__action__price" v-if="approved && owned">
                <label
                  ><input type="text" v-model="price" id="amount" /> ETH</label
                >
              </div>
              <div class="l-item__action__textarea" v-if="approved && owned">
                <textarea
                  v-model="msg"
                  name=""
                  id=""
                  box
                  auto-grow
                  :placeholder="$t('id.inputMessage')"
                >
                </textarea>
              </div>
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

                <div
                  class="l-item__action__btns"
                  v-else-if="approved && !order.id"
                >
                  <v-btn
                    class="l-item__action__btn l-item__action__btn--type1 white_text"
                    :disabled="!valid || loading || !approved || !checkbox ||!account.address"
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

                <div
                  class="l-item__action__btns"
                  v-else-if="approved && order.id"
                >
                  <v-btn
                    class="l-item__action__btn l-item__action__btn--type1 white_text"
                    :disabled="!valid || loading || !approved || !checkbox"
                    color="#3498db"
                    large
                    @click="order_v1('change')"
                  >
                    {{ order.price / 1000000000000000000 }} -> change
                    <v-progress-circular
                      size="16"
                      class="ma-2"
                      v-if="loading"
                      indeterminate
                    ></v-progress-circular>
                  </v-btn>
                  <v-btn
                    class="l-item__action__btn l-item__action__btn--type1 white_text"
                    :disabled="!valid || loading || !approved || !checkbox"
                    color="#3498db"
                    large
                    @click="cancel"
                  >
                    cancel
                    <v-progress-circular
                      size="16"
                      class="ma-2"
                      v-if="loading"
                      indeterminate
                    ></v-progress-circular>
                  </v-btn>
                </div>
                <v-checkbox
                  v-model="checkbox"
                  :rules="[v => !!v || '']"
                  label="利用規約に同意する"
                  required
                  v-if="approved && owned"
                ></v-checkbox>
              </div>
            </div>
          </v-form>
        </div>
      </div>
    </section>
    <canvas id="ogp" width="1200" height="630" hidden></canvas>
    <modal
      v-if="modal"
      v-on:closeModal="closeModal"
      v-on:transitionTop="transitionTop"
      v-on:transitionOrder="transitionOrder"
      :ogp="ogp"
      :asset="asset"
      :hash="hash"
      :host="host"
      :modalNo="modalNo"
    ></modal>
  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'
import kitty from '~/plugins/kitty'
import Modal from '~/components/modal'

const config = require('../../../config.json')
const project = process.env.project
const host = config.host[project]
export default {
  components: {
    Modal
  },
  data() {
    return {
      modal: false,
      modalNo: '',
      tokenOwner: false,
      hash: '',
      ogp: '',
      price: '',
      loading: false,
      valid: true,
      checkbox: false,
      approved: false,
      owned: false,
      owner: '',
      msg: '',
      host,
    }
  },
  async asyncData({ store, params, error }) {
    try {
      const asset = await kitty.getKittyById(params.id)
      store.dispatch('asset/setAsset', asset)
    } catch(err){
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  mounted: async function() {
    const store = this.$store
    const params = this.$route.params

    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)
      }

      client.contract.ck.methods
        .kittyIndexToOwner(params.id)
        .call()
        .then(owner => {
          this.owned = owner == this.account.address
        })

      client.contract.ck.methods
        .kittyIndexToApproved(params.id)
        .call()
        .then(approvedAddress => {
          this.approved =
            approvedAddress == client.contract.bazaaar_v1.options.address
        })

      firestore
        .getLowestCostOrderByMakerId(client.account.address, params.id)
        .then(order => {
          store.dispatch('order/setOrder', order)
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
    coolDownIndexToSpeed(index) {
      return kitty.coolDownIndexToSpeed(index)
    },
    getRarity(asset) {
        return kitty.getRarity(asset)
    },
    closeModal() {
      this.modal = false
    },
    transitionTop() {
      const router = this.$router
      this.modal = false
      router.push({ path: '/'})
    },
    transitionOrder() {
      const router = this.$router
      this.modal = false
      router.push({ path: '/ck/order/' + this.hash })
    },
    async order_v1(type) {
      try {
        console.log('order_v1')
        this.loading = true
        const account = this.account
        const asset = this.asset.ck
        const params = this.$route.params
        const router = this.$router
        const amount = this.price
        const wei = client.utils.toWei(amount)
        if (
          type == 'change' &&
          this.order.price / 1000000000000000000 <= amount
        ) {
          alert('make it cheeper')
          return
        }

        const approved = await client.contract.ck.methods
          .kittyIndexToApproved(params.id)
          .call()

        if (approved == client.contract.bazaaar_v1.options.address) {
          console.log('approved')
          const nonce = await client.contract.bazaaar_v1.methods
            .nonce_(
              account.address,
              client.contract.ck.options.address,
              params.id
            )
            .call()

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
          const datas = {
            order: signedOrder,
            msg: this.msg
          }
          var result = await functions.call('order', datas)
        
          this.hash = result.hash
          this.ogp = result.ogp
          this.modalNo = 1
          this.modal = true
        }
        this.loading = false
      } catch (err) {
        alert(this.$t('error.message'))
        this.loading = false;
      }
    },
    async approve() {
      try{
      this.loading = true
      const account = this.account
      const params = this.$route.params
      client.contract.ck.methods
        .approve(client.contract.bazaaar_v1.options.address, params.id)
        .send({ from: account.address })
        .on('transactionHash', hash => {
          console.log(hash)
          this.hash = hash
          this.modalNo = 2
          this.modal = true
          this.loading = false
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log(receipt)
          location.reload()
        })
      } catch (err) {
        alert(this.$t('error.message'))
        this.loading = false;
      }
    },
    async cancel() {
      try{
        this.loading = true
        const account = this.account
        const order = this.order
        console.log(order)

        await client.contract.bazaaar_v1.methods
          .orderCancel_(
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
          .on('transactionHash', hash => {
            console.log(hash)
            this.hash = hash
            this.modalNo = 3
            this.modal = true
            this.loading = false
          })
      } catch (err) {
        alert(this.$t('error.message'))
        this.loading = false;

      }
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
