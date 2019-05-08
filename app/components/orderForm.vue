<template>
  <div>
    <v-form>
    <div class="l-item__action">
        <div class="l-item__action__price" v-if="approved && owned">
        <label
            ><input type="text" v-model="amount" id="amount"/> ETH
            <input type="text" style="display:none"></label
        >
        </div>
        <div v-if="approved && owned">{{$t("id.fee")}}</div>
        <div class="l-item__action__textarea" v-if="approved && owned">
        <v-text-field
            v-model="messege"
            :rules="msgRules"
            :counter="18"
            :placeholder="$t('id.inputMessage')"
        ></v-text-field>
        </div>
        <div v-if="owned">
        <div class="l-item__action__btns" v-if="!approved">
            <v-btn
            class="l-item__action__btn"
            :disabled="!valid || loading"
            large
            @click="$emit('approve')"
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
            :disabled="!valid || loading || !approved || !checkboxBool ||!account.address"
            color="#3498db"
            large
            @click="$emit('order_v1', '', amount, messege)"
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
            :disabled="!valid || loading || !approved || !checkboxBool || waitDiscount"
            color="#3498db"
            large
            @click="$emit('order_v1', 'change', amount, messege)"
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
            :disabled="!valid || loadingCancel || !approved || !checkboxBool || waitCancel"
            color="#3498db"
            large
            @click="$emit('cancel')"
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
            v-model="checkboxBool"
            :rules="[v => !!v || '']"
            :label="$t('id.agree')"
            required
            v-if="approved && owned"
        ></v-checkbox>
        </div>
    </div>
    </v-form>
  </div>
</template>

<script>
export default {
    props: ['order','account','msgRules','owned', 'valid', 'loadingCancel', 'approved', 'checkbox','waitDiscount','waitCancel','loading'],
    data() {
      return {
        amount: '',
        messege: '',
        checkboxBool: this.checkbox
      };
    }
}// @change="$emit('priceOrder', price)"
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