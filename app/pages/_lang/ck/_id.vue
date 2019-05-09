<template>
  <div>
    <section class="l-item">
      <id
            v-on:approve="approve"
            v-on:order_v1="order_v1"
            v-on:cancel="cancel"
            :order="order"
            :owned="owned"
            :valid="valid"
            :loadingCancel="loadingCancel"
            :approved="approved"
            :waitDiscount="waitDiscount"
            :waitCancel="waitCancel"
            :loading="loading"
            :checkbox="checkbox"
            :ogp="ogp"
            :msgRules="msgRules"
            :account="account"
            :asset="asset"
          ></id>
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
import api from '~/plugins/api'
import lib from '~/plugins/lib'
import Modal from '~/components/modal'
import Related from '~/components/related'
import id from '~/components/id'


const config = require('../../../config.json')
const project = process.env.project
const host = config.host[project]

export default {
  components: {
    Modal,
    Related,
    id
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
      type: { name: 'CryptoKitties', symbol: 'ck'}
    }
  },
  async asyncData({ store, params, error }) {
    try {
      // const data = {
      //   asset: 'ck',
      //   id: params.id
      // }
      // const asset = await functions.call('metadata', data)
      const asset = await api.getKittyById(params.id)
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
          this.price = client.utils.fromWei(order.price)
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
      router.push({ path: '/ck/order/' + this.hash })
    },
    async order_v1(type) {
      const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
      try {
        console.log('order_v1')
        this.loading = true
        this.waitCancel = true
        this.modalNo = 5
        this.modal = true
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
          this.loading = false
          this.modal = false
          this.waitCancel = false
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
          //const date = new Date()
          //date.setDate(date.getDate() + 7)
          //const expiration = Math.round(date.getTime() / 1000)
          const expiration = Math.round(9999999999999 / 1000) - 1
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
      client.contract.ck.methods
        .approve(client.contract.bazaaar_v1.options.address, params.id)
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
.white_text {
  color: white;
}

.small{
  font-size: 60%;
}
</style>
