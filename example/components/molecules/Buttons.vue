<template>
  <div>
    <v-btn
      v-if="asset.owner.address !== this.$store.state.address && asset.order"
      small
      round
      color="primary"
      @click.stop="executeBuy"
      >{{ this.$web3.utils.fromWei(asset.order.takerAssetAmount.toString()) }} ETH<v-icon small right
        >add_shopping_cart</v-icon
      ></v-btn
    >
    <v-btn
      v-if="asset.owner.address === this.$store.state.address && asset.order"
      small
      round
      color="primary"
      @click.stop="executeCancel"
      >Cancel<v-icon small right>money_off</v-icon></v-btn
    >
    <v-btn
      v-if="asset.owner.address === this.$store.state.address && !asset.order"
      small
      round
      color="primary"
      @click.stop="sell"
      >Sell<v-icon small right>attach_money</v-icon></v-btn
    >
    <v-btn
      v-if="asset.owner.address === this.$store.state.address && !asset.order"
      small
      round
      color="primary"
      @click.stop="gift"
      >Gift<v-icon small right>card_giftcard</v-icon></v-btn
    >
    <v-layout row justify-center>
      <v-dialog v-model="dialogDisplay" max-width="500">
        <v-card class="pa-3">
          <div v-if="dialogKey == 1">
            <v-card-title class="headline">Input Receiver Address.</v-card-title>
            <v-card-text>
              <v-text-field v-model="giftToAddress" label="address" placeholder="0x..."></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="closeDialog">
                Cancel
              </v-btn>
              <v-btn color="primary" flat @click="executeGift">
                Confirm
              </v-btn>
            </v-card-actions>
          </div>
          <div v-if="dialogKey == 2">
            <v-card-title class="headline">Input Price.</v-card-title>
            <v-card-text>
              <v-text-field v-model="takerAssetAmount" label="amount" placeholder="ETH"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="closeDialog">
                Cancel
              </v-btn>
              <v-btn color="primary" flat @click="executeSell">
                Confirm
              </v-btn>
            </v-card-actions>
          </div>
          <div v-if="dialogKey == 3">
            <v-card-title class="headline">You must approve it.</v-card-title>
          </div>
          <div v-if="dialogKey == 4">
            <v-card-title class="headline">Please confirm transaction on web3 wallet.</v-card-title>
          </div>
          <div v-if="dialogKey == 5">
            <v-card-title class="headline">Signature</v-card-title>
          </div>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

const exceptions = {
  '0x16baf0de678e52367adc69fd067e5edd1d33e3bf': [
    {
      constant: true,
      inputs: [{ name: '', type: 'uint256' }],
      name: 'kittyIndexToApproved',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_approved',
          type: 'address'
        },
        {
          name: '_tokenId',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    }
  ]
}

const contracts = {}

@Component
export default class Buttons extends Vue {
  dialogDisplay = false
  dialogKey = 0
  giftToAddress = ''
  takerAssetAmount = 0

  @Prop() asset
  openDialog(dialogKey) {
    this.dialogDisplay = true
    this.dialogKey = dialogKey
  }
  closeDialog() {
    this.dialogDisplay = false
  }
  gift() {
    this.openDialog(1)
  }
  executeGift() {
    this.openDialog(4)
    this.$satellites.gift(
      this.asset.asset_contract.address,
      this.giftToAddress,
      this.$store.state.address,
      this.asset.token_id
    )
  }
  async sell() {
    let approved = false
    if (!exceptions[this.asset.asset_contract.address]) {
      approved = await this.$satellites.erc721Token.isApprovedForAllAsync(
        this.asset.asset_contract.address,
        this.$store.state.address,
        this.$satellites.contractAddresses.erc721Proxy
      )
    } else {
      const name = exceptions[this.asset.asset_contract.address][0].name
      if (!contracts[this.asset.asset_contract.address]) {
        const contract = new this.$web3.eth.Contract(
          exceptions[this.asset.asset_contract.address],
          this.asset.asset_contract.address
        )
        contracts[this.asset.asset_contract.address] = contract
      }
      const operator = await contracts[this.asset.asset_contract.address].methods[name](this.asset.token_id).call()
      approved = operator.toLowerCase() === this.$satellites.contractAddresses.erc721Proxy
    }

    if (!approved) {
      await this.executeApprove()
    } else {
      this.openDialog(2)
    }
  }

  async executeSell() {
    this.openDialog(5)
    await this.$satellites.sell(
      this.$store.state.address,
      this.asset.asset_contract.address,
      this.asset.token_id,
      this.takerAssetAmount
    )
  }

  async executeApprove() {
    this.openDialog(3)

    if (!exceptions[this.asset.asset_contract.address]) {
      await this.$satellites.erc721Token.setApprovalForAllAsync(
        this.asset.asset_contract.address,
        this.$store.state.address,
        this.$satellites.contractAddresses.erc721Proxy,
        true
      )
    } else {
      const name = exceptions[this.asset.asset_contract.address][1].name
      if (!contracts[this.asset.asset_contract.address]) {
        const contract = new this.$web3.eth.Contract(
          exceptions[this.asset.asset_contract.address],
          this.asset.asset_contract.address
        )
        contracts[this.asset.asset_contract.address] = contract
      }
      await contracts[this.asset.asset_contract.address].methods[name](
        this.$satellites.contractAddresses.erc721Proxy,
        this.asset.token_id
      ).send({ from: this.$store.state.address })
    }
  }

  async executeBuy() {
    this.openDialog(4)
    await this.$satellites.buy(this.$store.state.address, this.asset.order)
  }

  async executeCancel() {
    this.openDialog(4)
    await this.$satellites.cancel(this.asset.order)
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
