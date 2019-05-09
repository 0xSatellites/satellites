<template>
  <div>
    <section class="l-item">
      <div class="l-item__frame">
        <div>
          <div class="l-item__img">
            <iframe style="border-style: none; width: 100%; zoom: 1.5;" :src="'https://www.crypt-oink.io/viewer/?' + $route.params.id"></iframe>
          </div>
        </div>
        <div>
          <div class="l-item__name"  v-if="asset.name">{{ asset.name.substring(0,25) }}</div>
          <div class="l-item__txt">{{ asset.description }}</div>
          <div class="l-item__txt">
            Crypt-Oink
          </div>
          <ul class="l-item__data">
          <li><span class="l-item__rarity l-item__rarity--5" v-for="(i) in getRarity(asset, 'ctn')" :key="i + '-rarity'">★</span></li>
          </ul>
          <ul class="l-item__data">
          <li><strong>Gen：</strong> {{generation}} </li>
          <li><strong>Cooldown：</strong> {{cooldownIndex}}</li>
          </ul>

          <v-form>
            <div class="l-item__action">
              <div class="l-item__action__price" v-if="approved && owned">
                <label
                  ><input type="text" v-model="price" id="amount"/> ETH
                  <input type="text" style="display:none"></label
                >
              </div>
              <div v-if="approved && owned">{{$t("id.fee")}}</div>
              <div class="l-item__action__textarea" v-if="approved && owned">
                <v-text-field
                  v-model="msg"
                  :rules="msgRules"
                  :counter="18"
                  :placeholder="$t('id.inputMessage')"
                ></v-text-field>
              </div>
              <div v-if="approved && owned" class="small">(<a href="/terms">{{$t('id.terms')}}</a>)</div>
              <v-checkbox
                  v-model="checkbox"
                  :rules="[v => !!v || '']"
                  :label="$t('id.agree')"
                  required
                  v-if="approved && owned"
                  height ="20"
                ></v-checkbox>
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
                    :disabled="!valid || loading || !approved || !checkbox || waitDiscount"
                    color="#3498db"
                    large
                    @click="order_v1('change')"
                  >
                    DISCOUNT
                    <v-progress-circular
                      size="16"
                      class="ma-2"
                      v-if="loading"
                      indeterminate
                    ></v-progress-circular>
                  </v-btn>
                  <v-btn
                    class="l-item__action__btn l-item__action__btn--type1 white_text"
                    :disabled="!valid || loadingCancel || !approved || !checkbox || waitCancel"
                    color="#3498db"
                    large
                    @click="cancel"
                  >
                    cancel
                    <v-progress-circular
                      size="16"
                      class="ma-2"
                      v-if="loadingCancel"
                      indeterminate
                    ></v-progress-circular>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-form>
        </div>
      </div>
    </section>
    <section class="c-index c-index--recommend mt-5" v-if="recommend.length">
      <h2 class="c-index__title">{{$t('id.relatedAsset')}}</h2>
      <related
        :recommend="recommend"
      ></related>
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
      :type="type"
    ></modal>
  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'
import lib from '~/plugins/lib'
import api from '~/plugins/api'
import Modal from '~/components/modal'
import Related from '~/components/related'

const config = require('../../../config.json')
const axios = require('axios')
const project = process.env.project
const host = config.host[project]

export default {
  components: {
    Modal,
    Related
  },
  data() {
    return {
      iframe: "",
      modal: false,
      modalNo: '',
      tokenOwner: false,
      hash: '',
      ogp: '',
      price: '',
      loading: false,
      loadingCancel: false,
      waitDiscount: false,
      waitCancel: false,
      valid: true,
      checkbox: false,
      approved: false,
      owned: false,
      owner: '',
      msg: '',
      msgRules: [
        v => v.length <= 18 || 'Message must be less than 18 characters'
      ],
      host,
      generation: 0,
      cooldownIndex: 0,
      type: { name: 'くりぷ豚', symbol: 'ctn'}
    }
  },
  async asyncData({ store, params, error }) {
    try {
      let result = await axios.get(
        config.functions[project] + 'metadata?asset=ctn&id=' +params.id
      )
      const asset = result.data
      store.dispatch('asset/setAsset', asset)
      const recommend = await firestore.getLatestValidOrders(4)
      await store.dispatch('order/setOrders', recommend)
    } catch(err){
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  mounted: async function() {
    const store = this.$store
    const params = this.$route.params
    var account
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        if(window.ethereum){
          account = await client.activate(ethereum)
        } else {
          account = await client.activate(web3.currentProvider)
        }
        store.dispatch('account/setAccount', account)
      }

      client.contract.ctn.methods
        .entityIndexToOwner(params.id)
        .call()
        .then(owner => {
          this.owned = owner == this.account.address
        })

      client.contract.ctn.methods
        .entityIndexToApproved(params.id)
        .call()
        .then(approvedAddress => {
          this.approved =
            approvedAddress == client.contract.bazaaar_v2.options.address

        })

      firestore
        .getLowestCostOrderByMakerId(client.account.address, params.id)
        .then(order => {
          store.dispatch('order/setOrder', order)
          if(order.price){
            this.price = client.utils.fromWei(order.price)
          }
        })

      const entities = await client.contract.ctn.methods
           .getEntity(params.id)
           .call()
          this.generation = await entities.generation
          this.cooldown_index = await entities.cooldownIndex
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
    },
    recommend() {
      return this.$store.getters['order/orders']
    }
  },
  methods: {
    coolDownIndexToSpeed(index) {
      return lib.coolDownIndexToSpeed(index)
    },
    getRarity(asset, type) {
      return lib.getRarity(asset, type)
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
      router.push({ path: '/ctn/order/' + this.hash })
    },
    async order_v1(type) {
      const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
      try {
        console.log('order_v2')
        this.loading = true
        this.waitCancel = true
        this.modalNo = 5
        this.modal = true
        const account = this.account
        const asset = this.asset.ctn
        const params = this.$route.params
        const router = this.$router
        const amount = this.price
        const wei = client.utils.toWei(amount)
        if (
          type == 'change' &&
          this.order.price / 1000000000000000000 <= amount
        ) {
          alert('make it cheeper')
          this.loading = false
          this.modal = false
          this.waitCancel = false
          return
        }

        const approved = await client.contract.ctn.methods
          .entityIndexToApproved(params.id)
          .call()
        if (approved == client.contract.bazaaar_v2.options.address) {
          console.log('approved')
          const nonce = await client.contract.bazaaar_v2.methods
            .nonce_(
              account.address,
              client.contract.ctn.options.address,
              params.id
            )
            .call()

          const salt = Math.floor(Math.random() * 1000000000)
          //const date = new Date()
          //date.setDate(date.getDate() + 7)
          //const expiration = Math.round(date.getTime() / 1000)
          const expiration = Math.round(9999999999999 / 1000) - 1
          const order = {
            proxy: client.contract.bazaaar_v2.options.address,
            maker: account.address,
            taker: config.constant.nulladdress,
            creatorRoyaltyRecipient: config.recipient[project].ctn,
            asset: client.contract.ctn.options.address,
            id: params.id,
            price: wei,
            nonce: nonce,
            salt: salt,
            expiration: expiration,
            creatorRoyaltyRatio: 500,
            referralRatio: 500
          }
          const signedOrder = await client.signOrder(order)
          const datas = {
            order: signedOrder,
            msg: this.msg
          }
          var result = await functions.call('order', datas)
          this.hash = result.hash
          this.ogp = result.ogp
          this.modal = false
          await sleep(1)
          this.modalNo = 1
          this.modal = true
        }
        this.loading = false
        this.waitCancel = false
      } catch (err) {
        alert(this.$t('error.message'))
        this.loading = false
        this.modal = false
        this.waitCancel = false
      }
    },
    async approve() {
      try{
      this.loading = true
      const account = this.account
      const params = this.$route.params
      client.contract.ctn.methods
        .approve(client.contract.bazaaar_v2.options.address, params.id)
        .send({ from: account.address })
        .on('transactionHash', hash => {
          this.hash = hash
          this.modalNo = 2
          this.modal = true
          this.loading = false
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          location.reload()
        }).catch((err) => {
          alert(this.$t('error.message'))
          this.loading = false;
        })
      } catch (err) {
        alert(this.$t('error.message'))
        this.loading = false;
      }
    },
    async cancel() {
      try{
        this.loadingCancel = true
        this.waitDiscount = true
        const account = this.account
        const order = this.order

        await client.contract.bazaaar_v2.methods
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
            this.hash = hash
            this.modalNo = 3
            this.modal = true
            this.loadingCancel = false
            this.waitDiscount = false
          })
      } catch (err) {
        alert(this.$t('error.message'))
        this.loadingCancel = false
        this.waitDiscount = false
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

.small{
  font-size: 60%;
}
</style>
