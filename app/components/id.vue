<template>
<div>
 <section class="l-item">
  <div class="l-item__frame">
    <div class="l-item__img">
      <iframe style="border-style: none; width: 100%; zoom: 1.5;" :src="'https://www.crypt-oink.io/viewer/?' + $route.params.id" v-if="asset.iframe"></iframe>
      <img :src="asset.image" alt="" v-else />
      <img :src="'https://www.mycryptoheroes.net/arts/'+asset.extra_data.current_art" v-if="asset.mch_artedit" >
            <div class="favorite" v-if="asset.mch_artedit">
              <v-layout
                align-center
              >
                <v-icon color="red">favorite</v-icon>
                <span class="subheading">{{asset.current_art_data.attributes.likes}}</span>
              </v-layout>
            </div>
    </div>

    <div class="l-item__area">
      <div class="l-item__name" v-if="assetType === 'ck' || assetType === 'ctn'">{{ asset.name }}</div>
      <div class="l-item__name" v-if="assetType == 'mchh'">{{ asset.hero_type.name[lang] }}</div>
      <div class="l-item__name" v-if="assetType == 'mche'">{{ asset.extension_type.name[lang] }}</div>
      <div class="l-item__txt" v-if="assetType === 'ck' || assetType === 'ctn'"># {{ asset.id }}</div>
      <div class="l-item__txt" v-if="assetType == 'mchh' || assetType == 'mche'">{{ `Id: ${asset.attributes.id} / Lv: ${asset.attributes.lv} `}}</div>
      <div class="l-item__txt" v-if="assetType == 'mrm'">{{ asset.name }}</div>
      <div class="l-item__txt" v-if="assetType == 'mrm'">{{ `#${asset.attributes.id}` }}</div>

      <div class="l-item__txt">{{ $t('asset.' + assetType) }}</div>
      <ul class="l-item__data">
        <li><span class="l-item__rarity l-item__rarity--5" v-for="i in getRarity(asset, assetType)" :key="i + '-rarity'">★</span></li>
      </ul>

      <ul class="l-item__data" style="display: block" v-if="assetType === 'mrm'">
        <li><strong>Artist：</strong>{{ asset.attributes.Artist}}</li>
        <li><strong>Label：</strong>{{ asset.attributes.Label}}</li>
        <li><strong>Artwork</strong>{{ asset.attributes.Artwork}}</li>
        <li><strong>Mastering Engineer：</strong>{{ asset.attributes.Mastering_Enginner}}</li>
        <li><strong>Contract Design：</strong>{{ asset.attributes.Contract_Designer}}</li>
        <li><strong>Executive Producer：</strong>{{ asset.attributes.Executive_Producer}}</li>
      </ul>

      <ul class="l-item__data" v-if="assetType === 'ck' || assetType === 'ctn'">
        <li><strong>Gen：</strong> {{ asset.generation }}</li>
        <li><strong>Cooldown：</strong> {{ coolDownIndexToSpeed(asset.status.cooldown_index) }}</li>
      </ul>

      <ul class="l-item__data" v-if="assetType == 'mchh' || assetType == 'mche'">
        <li><strong>HP：</strong> {{ asset.attributes.hp }}</li>
        <li><strong>PHY：</strong> {{ asset.attributes.phy }}</li>
        <li><strong>INT：</strong> {{ asset.attributes.int }}</li>
        <li><strong>AGI：</strong> {{ asset.attributes.agi }}</li>
      </ul>
      <ul class="l-item__data" v-if="lang && assetType == 'mchh'">
        <li>
          <span class="l-item__skill--type">Active</span><b>{{ asset.active_skill.name[lang] }}</b
          ><br />{{ asset.active_skill.description[lang].effects[0] }}
        </li>
        <li>
          <span class="l-item__skill--type">Passive</span><b>{{ asset.passive_skill.name[lang] }}</b
          ><br />{{ asset.passive_skill.description[lang].effects[0] }}
        </li>
      </ul>
      <ul class="l-item__data" v-if="lang && assetType == 'mche'">
        <li>
          <span class="l-item__skill--type">Passive</span><b>{{ asset.skill.name[lang] }}</b
          ><br />{{ asset.skill.description[lang].effects[0] }}
        </li>
      </ul>

      <v-form>
        <div class="l-item__action">
          <div class="l-item__action__price" v-if="approved && owned">
            <label><input type="text" v-model="price" id="amount"/> ETH <input type="text" style="display:none"/></label>
          </div>
          <div class="l-item__action__textarea" v-if="approved && owned">
            <v-text-field v-model="msg" :counter="18" :placeholder="$t('id.inputMessage')"></v-text-field>
          </div>
          <div v-if="approved && owned" class="small">
            (<a href="/terms">{{ $t('id.terms') }}</a
            >)
          </div>
          <v-checkbox v-model="checkbox" :rules="[v => !!v || '']" :label="$t('id.agree')" required v-if="approved && owned" height="20"></v-checkbox>

          <div v-if="assetType=='mrm'" class="l-item__txt">
            <a href="/myitems">
            {{ $t('id.mrm_sell_condition')}}
            </a>
            </div>
          <div v-if="owned">
            <div class="l-item__action__btns" v-if="!approved">
              <v-btn class="l-item__action__btn" :disabled="!valid || loading" large @click="approve">
                {{ $t('id.approve') }}
                <v-progress-circular size="16" class="ma-2" v-if="loading" indeterminate></v-progress-circular>
              </v-btn>
            </div>

            <div class="l-item__action__btns" v-else-if="approved && !order.id">
              <v-btn
                class="l-item__action__btn l-item__action__btn--type1 white_text"
                :disabled="!isLogin || !valid || loading || !approved || !checkbox || !account.address"
                color="#3498db"
                large
                @click="order_v1"
              >
                {{ $t('id.sell') }}
              </v-btn>
            </div>
            <div class="l-item__action__btns" v-else-if="approved && order.id">
              <v-btn
                class="l-item__action__btn l-item__action__btn--type1 white_text"
                :disabled="!valid || loading || !approved || !checkbox || waitDiscount"
                color="#3498db"
                large
                @click="order_v1('change')"
              >
                DISCOUNT
                <v-progress-circular size="16" class="ma-2" v-if="loading" indeterminate></v-progress-circular>
              </v-btn>
              <v-btn
                class="l-item__action__btn l-item__action__btn--type1 white_text"
                :disabled="!valid || loadingCancel || !approved || !checkbox || waitCancel"
                color="#3498db"
                large
                @click="cancel"
              >
                cancel
                <v-progress-circular size="16" class="ma-2" v-if="loadingCancel" indeterminate></v-progress-circular>
              </v-btn>
            </div>
            <div class="l-item__action_btns" style="margin-top: 10px" v-if="assetType=='mrm'">
              <v-btn class="l-item__action__btn" :disabled="!valid || loading" large :href="asset.audio_url" target="_blank">
                audio_url
              </v-btn>
              <v-btn class="l-item__action__btn" :disabled="!valid || loading" large :href="asset.track_data" target="_blank">
                track_data
              </v-btn>
            </div>
          </div>
        </div>
        <br>
        <!-- <div class="l-item__action">
          <div v-if="owned">
            <div class="l-item__action__textarea"
            >
              <label>{{$t('id.giftLabel')}}</label>
              <v-text-field v-model="giftReceiverAddress" :placeholder="$t('id.giftReceiverAddress')"></v-text-field>
            </div>
            <div class="l-item__action__btns">
                <v-btn
                  class="l-item__action__btn l-item__action__btn--type1 white_text"
                  :disabled="loading"
                  color="#3498db"
                  large
                  @click="gift"
                >
                  {{$t('id.gift')}}
                <v-progress-circular size="16" class="ma-2" v-if="loading" indeterminate></v-progress-circular>
              </v-btn>
            </div>
          </div>
        </div> -->
      </v-form>
    </div>
  </div>
 </section>
  <related></related>
 <modal
      v-if="modal"
      v-on:closeModal="closeModal"
      :ogp="ogp"
      :hash="hash"
      :modalNo="modalNo"
    ></modal>
</div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import lib from '~/plugins/lib'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'
import Modal from '~/components/modal'
import Related from '~/components/related'
import api from '~/plugins/api'
import { constants } from 'crypto';

const config = require('../../functions/config.json')
const project = process.env.project


export default {
  components: {
    Modal,
    Related
  },
  props: ['type'],
  data() {
    return {
      modal: false,
      modalNo: '',
      hash: '',
      ogp: '',
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
      price: '',
      giftReceiverAddress:"",
      isLogin: false,
      twitterAccount: [],
    }
  },
  mounted: async function() {
    const store = this.$store
    const params = this.$route.params
    var account
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        if (window.ethereum) {
          account = await client.activate(ethereum)
        } else {
          account = await client.activate(web3.currentProvider)
        }
        store.dispatch('account/setAccount', account)
      }

      if (store.getters['account/account'].twitterAccount.isSigned){
        this.isLogin = true,
        this.twitterAccount = store.getters['account/account'].twitterAccount
      }

      if (this.assetType == 'ck') {
        client.contract.ck.methods
          .kittyIndexToApproved(params.id)
          .call()
          .then(approvedAddress => {
            this.approved = approvedAddress == client.contract.bazaaar.options.address
          })

        client.contract.ck.methods
          .kittyIndexToOwner(params.id)
          .call()
          .then(owner => {
            this.owned = owner == this.account.address
          })
      } else if (this.assetType == 'ctn') {
        client.contract.ctn.methods
          .entityIndexToApproved(params.id)
          .call()
          .then(approvedAddress => {
            this.approved = approvedAddress == client.contract.bazaaar.options.address
          })

        client.contract.ctn.methods
          .entityIndexToOwner(params.id)
          .call()
          .then(owner => {
            this.owned = owner == this.account.address
          })
      } else {
        client.contract[this.assetType].methods
          .isApprovedForAll(this.account.address, client.contract.bazaaar.options.address)
          .call()
          .then(result => {
            this.approved = result
          })
        client.contract[this.assetType].methods
          .ownerOf(params.id)
          .call()
          .then(owner => {
            //if (this.asset.sellable) {
              this.owned = owner == this.account.address
            //}
          })
      }

      firestore.getLowestCostOrderByMakerId(client.account.address, params.id).then(order => {
        store.dispatch('order/setOrder', order)
        if (order.price) {
          this.price = client.utils.fromWei(order.price)
        }
      })
    }
  },
  computed: {
    assetType() {
      const routeNames = this.$route.name.split('-')
      if (routeNames[0] == 'lang') return routeNames[1]
      else return routeNames[0]
    },
    lang() {
      return this.$store.state.i18n.locale
    },
    account() {
      return this.$store.getters['account/account']
    },
    asset() {
      return this.$store.getters['asset/asset']
    },
    order() {
      return this.$store.getters['order/order']
    },
  },
  methods: {
    getRarity(asset, type) {
      return lib.getRarity(asset, type)
    },
    fromWei(wei) {
      return client.utils.fromWei(wei)
    },
    coolDownIndexToSpeed(index) {
      return lib.coolDownIndexToSpeed(index)
    },
    async gift() {
      this.loading = true
      this.waitCancel = true
      this.modalNo = 7
      var result = false
      try{
        if (this.assetType == 'ck') {
          await client.contract.ck.methods.transfer(this.giftReceiverAddress, this.$route.params.id)
          .send({ from: this.account.address })
          .on('transactionHash', hash => {
            this.hash = hash
            this.modal = true
            this.loading = false
          })
          result = true
        } else if (this.assetType == 'ctn') {
          await client.contract.ctn.methods.transfer(this.giftReceiverAddress, this.$route.params.id)
          .send({ from: this.account.address }).on('transactionHash', hash => {
            this.hash = hash
            this.modal = true
            this.loading = false
          })
        } else if (this.assetType == 'mchh') {
          await client.contract.mchh.methods.transferFrom(this.account.address, this.giftReceiverAddress, this.$route.params.id)
          .send({ from: this.account.address })
          .on('transactionHash', hash => {
            this.hash = hash
            this.modal = true
            this.loading = false
          })
        } else if (this.assetType == 'mche'){
          await client.contract.mche.methods.transferFrom(this.account.address, this.giftReceiverAddress, this.$route.params.id)
          .send({ from: this.account.address })
          .on('transactionHash', hash => {
            this.hash = hash
            this.modal = true
            this.loading = false
          })
        } else if (this.assetType == 'mrm'){
          await client.contract.mrm.methods.transferFrom(this.account.address, this.giftReceiverAddress, this.$route.params.id)
          .send({ from: this.account.address })
          .on('transactionHash', hash => {
            this.hash = hash
            this.modal = true
            this.loading = false
          })
        }
      } catch (err) {
        alert(this.$t('error.message'))
        this.loading = false
        this.modal = false
        this.waitCancel = false
      }
    },
    async order_v1(type) {
      const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))
      try {
        this.loading = true
        this.waitCancel = true
        this.modalNo = 5
        this.modal = true
        const account = this.account
        const asset = this.asset[this.assetType]
        const params = this.$route.params
        const router = this.$router
        const amount = this.price
        const wei = client.utils.toWei(amount)
        if (type == 'change' && this.order.price / 1000000000000000000 <= amount) {
          alert('make it cheeper')
          this.loading = false
          this.modal = false
          this.waitCancel = false
          return
        }

        const nonce = await client.contract.bazaaar.methods.nonce_(account.address, client.contract[this.assetType].options.address, params.id).call()

        const salt = Math.floor(Math.random() * 1000000000)
        //const date = new Date()
        //date.setDate(date.getDate() + 7)
        //const expiration = Math.round(date.getTime() / 1000)
        let relayerRoyaltyRecipient = config.recipient[project].bazaaar
        let creatorRoyaltyRecipient = config.constant.nulladdress
        let relayerRoyaltyRatio = 1000
        let creatorRoyaltyRatio = 0
        if (this.assetType == 'ck') {
          relayerRoyaltyRatio = 0
          creatorRoyaltyRatio = 0
          } else if (this.assetType == 'ctn') {
          relayerRoyaltyRatio = 500
          creatorRoyaltyRatio = 500
          creatorRoyaltyRecipient = config.recipient[project].ctn
        } else if (this.assetType == 'mchh') {
          if (this.asset.extra_data.current_art) {
            relayerRoyaltyRecipient = config.recipient[project].mch_distributer
            creatorRoyaltyRecipient = this.asset.current_art_data.attributes.editor_address
            relayerRoyaltyRatio = 1000 - this.asset.royalty_rate
            creatorRoyaltyRatio = this.asset.royalty_rate
          } else {
            relayerRoyaltyRecipient = config.recipient[project].mch_distributer
          }
        } else if (this.assetType == 'mche'){
          relayerRoyaltyRecipient = config.recipient[project].mch_distributer
        } else if (this.assetType == "mrm"){
          relayerRoyaltyRecipient = config.recipient[project].mrm_distributer
          creatorRoyaltyRecipient = this.asset.Remixer_address
          relayerRoyaltyRatio = 650
          creatorRoyaltyRatio = 350
        }
        const expiration = Math.round(9999999999999 / 1000) - 1
        const order = {
          proxy: client.contract.bazaaar.options.address,
          maker: account.address,
          taker: config.constant.nulladdress,
          relayerRoyaltyRecipient: relayerRoyaltyRecipient,
          creatorRoyaltyRecipient: creatorRoyaltyRecipient,
          asset: client.contract[this.assetType].options.address,
          id: params.id,
          price: wei,
          nonce: nonce,
          salt: salt,
          expiration: expiration,
          relayerRoyaltyRatio: relayerRoyaltyRatio,
          creatorRoyaltyRatio: creatorRoyaltyRatio,
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
        this.loading = false
        this.waitCancel = false
      } catch (err) {
        console.log(err)
        alert(this.$t('error.message'))
        this.loading = false
        this.modal = false
        this.waitCancel = false
      }
    },
    async approve() {
      if (this.assetType == 'ck') {
        try {
          this.loading = true
          const account = this.account
          const params = this.$route.params
          client.contract.ck.methods
            .approve(client.contract.bazaaar.options.address, params.id)
            .send({ from: account.address })
            .on('transactionHash', hash => {
              this.hash = hash
              this.modalNo = 2
              this.modal = true
              this.loading = false
            })
            .on('confirmation', (confirmationNumber, receipt) => {
              location.reload()
            })
            .catch(err => {
              alert(this.$t('error.message'))
              this.loading = false
            })
        } catch (err) {
          alert(this.$t('error.message'))
          this.loading = false
        }
      } else if (this.assetType == 'ctn') {
        try {
          this.loading = true
          const account = this.account
          const params = this.$route.params
          client.contract.ctn.methods
            .approve(client.contract.bazaaar.options.address, params.id)
            .send({ from: account.address })
            .on('transactionHash', hash => {
              this.hash = hash
              this.modalNo = 2
              this.modal = true
              this.loading = false
            })
            .on('confirmation', (confirmationNumber, receipt) => {
              location.reload()
            })
            .catch(err => {
              alert(this.$t('error.message'))
              this.loading = false
            })
        } catch (err) {
          alert(this.$t('error.message'))
          this.loading = false
        }
      } else {
        try {
          this.loading = true
          const account = this.account
          const params = this.$route.params
          client.contract[this.assetType].methods
            .setApprovalForAll(client.contract.bazaaar.options.address, params.id)
            .send({ from: account.address })
            .on('transactionHash', hash => {
              this.hash = hash
              this.modalNo = 2
              this.modal = true
              this.loading = false
            })
            .on('confirmation', (confirmationNumber, receipt) => {
              location.reload()
            })
            .catch(err => {
              alert(this.$t('error.message'))
              this.loading = false
            })
        } catch (err) {
          alert(this.$t('error.message'))
          this.loading = false
        }
      }
    },
    async cancel() {
      try {
        this.loadingCancel = true
        this.waitDiscount = true
        const account = this.account
        const order = this.order

        await client.contract.bazaaar.methods
          .orderCancel_(
            [order.proxy, order.maker, order.taker, order.relayerRoyaltyRecipient, order.creatorRoyaltyRecipient, order.asset],
            [order.id, order.price, order.nonce, order.salt, order.expiration, order.relayerRoyaltyRatio, order.creatorRoyaltyRatio, order.referralRatio]
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
    },
    closeModal() {
        this.modal = false
    },

  }
}
</script>

<style scoped>
.white_text {
  color: white;
}
</style>
