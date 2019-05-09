<template>
    <div class="l-item__frame">
        <div>
          <div class="l-item__img">
            <img :src="asset.image_url" alt="" />
          </div>
        </div>
        <div>
          <div class="l-item__name"  v-if="asset.name">{{ asset.name.substring(0,25) }}</div>
          <div class="l-item__txt"># {{ asset.id }}</div>
          <div class="l-item__txt">
            CryptoKitties
          </div>
          <ul class="l-item__data">
          <li><span class="l-item__rarity l-item__rarity--5" v-for="(i) in getRarity(asset, 'ck')" :key="i + '-rarity'">★</span></li>
          </ul>
          <ul class="l-item__data">
          <li><strong>Gen：</strong> {{asset.generation}} </li>
          <li><strong>Cooldown：</strong> {{coolDownIndexToSpeed(asset.status.cooldown_index)}}</li>
          </ul>

          <v-form>
            <div class="l-item__action">
              <div class="l-item__action__price" v-if="approved && owned">
                <label
                  ><input type="text" v-model="price" id="amount"/> ETH
                  <input type="text" style="display:none"></label
                >
              </div>
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

</template>

<script>
import client from '~/plugins/ethereum-client'
import lib from '~/plugins/lib'


const config = require('../config.json')
const project = process.env.project
const ck = config.contract[project].ck
const ctn = config.contract[project].ctn
const mchh = config.contract[project].mchh
const mche = config.contract[project].mche


export default {
    props: ['order','account','msgRules','owned', 'valid', 'loadingCancel', 'approved', 'checkbox','waitDiscount','waitCancel','loading','asset'],
    data() {
      return {
        amount: '',
        messege: '',
        checkboxBool: this.checkbox
      };
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
    },
    data() {
        return{
            ck,
            ctn,
            mchh,
            mche,
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