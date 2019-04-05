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
          <div class="l-item__name"  v-if="asset.name">{{ asset.name.substring(0,25) }}</div>
          <div class="l-item__txt">{{ asset.description }}</div>
          <div class="l-item__txt">
            MyCryptoHeros
          </div>
          <ul class="l-item__data">
          <li><span class="l-item__rarity l-item__rarity--5" v-for="(i) in getRarity(asset)" :key="i + '-rarity'">★</span></li>
          </ul>
          <ul class="l-item__data">
          <li><strong>Active_skill：</strong> {{asset.attributes.active_skill}} </li>
          <li><strong>Passive_skill:：</strong> {{asset.attributes.passive_skill}} </li>
          </ul>
          <ul class="l-item__data">
            <li><strong>HP：</strong> {{asset.attributes.hp}}</li>
            <li><strong>Rarity：</strong> {{asset.attributes.rarity}}</li>
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
                <v-checkbox
                  v-model="checkbox"
                  :rules="[v => !!v || '']"
                  :label="$t('id.agree')"
                  required
                  v-if="approved && owned"
                ></v-checkbox>
              </div>
            </div>
          </v-form>
        </div>
      </div>
    </section>
    <section class="c-index c-index--recommend mt-5" v-if="recommend.length">
      <div>
      <h2 class="c-index__title">{{$t('id.relatedAsset')}}</h2>
      <ul>
        <li v-for="(recommend, i) in recommend" :key="i">
          <nuxt-link v-if="recommend.asset === ck" :to="$t('index.holdLanguageCK') + recommend.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(recommend.metadata)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="recommend.metadata.image_url" /></div>
              <div class="c-card__name" v-if="recommend.metadata.name">{{ recommend.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ recommend.id }}</div>
              <div class="c-card__txt">Gen {{recommend.metadata.generation}} : {{coolDownIndexToSpeed(recommend.metadata.status.cooldown_index)}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(recommend.price) }} ETH</div>
          </nuxt-link>
          <nuxt-link v-else-if="recommend.asset === ctn" :to="$t('index.holdLanguageCTN') + recommend.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(recommend.metadata)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="recommend.metadata.image_url" /></div>
              <div class="c-card__name" v-if="recommend.metadata.name">{{ recommend.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ recommend.id }}</div>
              <div class="c-card__txt">Gen {{recommend.metadata.generation}} : {{coolDownIndexToSpeed(Number(recommend.metadata.status.cooldown_index))}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(recommend.price) }} ETH</div>
          </nuxt-link>
        </li>
      </ul>
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
      :coolDownIndex="oinkCooldownIndex"
      :modalNo="modalNo"
      :type="type"
    ></modal>
  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import extensions from '~/plugins/extension'
import functions from '~/plugins/functions'
import extension from '~/plugins/extension'
import Modal from '~/components/modal'


const config = require('../../../config.json')
const project = process.env.project
const host = config.host[project]
const ck = config.contract[project].ck
const ctn = config.contract[project].ctn
const mchh = config.contract[project].mchh
const mche = config.contract[project].mche
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
      loadingCancel: false,
      waitDiscount: false,
      waitCancel: false,
      valid: true,
      checkbox: false,
      approved: false,
      owned: false,
      owner: '',
      msg: '',
      host,
      oinkCooldownIndex: 0,
      generation: 0,
      ck,
      ctn,
      mchh,
      mche,
      type: { name: 'マイクリ', symbol: 'mche'}
    }
  },
  async asyncData({ store, params, error }) {
    try {
      let result = await extension.getExtensionById(params.id)
      const asset = result

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

    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)
      }

      client.contract.mche.methods
        .ownerOf(params.id)
        .call()
        .then(owner => {
          this.owned = owner == this.account.address
        })

      client.contract.mche.methods
        .getApproved(params.id)
        .call()
        .then(approvedAddress => {
          console.log(approvedAddress)
          this.approved =
            approvedAddress == client.contract.bazaaar_3.options.address
          console.log(client.contract.bazaaar_v3.options.address)

        })

      firestore
        .getLowestCostOrderByMakerId(client.account.address, params.id)
        .then(order => {
          store.dispatch('order/setOrder', order)
          if(order.price){
            this.price = client.utils.fromWei(order.price)
          }
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
      return extension.coolDownIndexToSpeed(index)
    },
    getRarity(asset) {
      return extension.getRarity(asset)
    },
    fromWei(wei) {
      return client.utils.fromWei(wei)
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
      router.push({ path: '/mche/order/' + this.hash })
    },
    async order_v1(type) {
      const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
      try {
        console.log('order_v3')
        this.loading = true
        this.waitCancel = true
        this.modalNo = 5
        this.modal = true
        const account = this.account
        const asset = this.asset.mche
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

        const approved = await client.contract.mche.methods
          .getApproved(params.id)
          .call()
        if (approved == client.contract.bazaaar_v3.options.address) {
          console.log('approved')
          const nonce = await client.contract.bazaaar_v3.methods
            .nonce_(
              account.address,
              client.contract.mche.options.address,
              params.id
            )
            .call()

          const salt = Math.floor(Math.random() * 1000000000)
          const date = new Date()
          date.setDate(date.getDate() + 7)
          const expiration = Math.round(date.getTime() / 1000)
          const order = {
            proxy: client.contract.bazaaar_v3.options.address,
            maker: account.address,
            taker: config.constant.nulladdress,
            creatorRoyaltyRecipient: config.recipient[project].mche,
            asset: client.contract.mche.options.address,
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
      client.contract.mche.methods
        .setApprovalForAll(client.contract.bazaaar_3.options.address, params.id)
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
        console.log(order)

        await client.contract.bazaaar_v3.methods
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
</style>
