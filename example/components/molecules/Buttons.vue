<template>
  <v-card flat>
    <v-layout row justify-center>
      <v-card-actions class="justify-center">
        <v-btn
          v-if="asset.owner.address !== this.$store.state.address && asset.order"
          small
          color="primary"
          @click.stop="executeBuy"
          >Buy<v-icon small right>add_shopping_cart</v-icon></v-btn
        >
        <v-btn
          v-if="asset.owner.address === this.$store.state.address && asset.order"
          small
          color="primary"
          @click.stop="executeCancel"
          >Cancel<v-icon small right>money_off</v-icon></v-btn
        >
        <v-btn
          v-if="asset.owner.address === this.$store.state.address && !asset.order"
          small
          color="primary"
          @click.stop="sell"
          >Sell<v-icon small right>attach_money</v-icon></v-btn
        >
        <v-btn
          v-if="asset.owner.address === this.$store.state.address && !asset.order"
          small
          color="primary"
          @click.stop="gift"
          >Gift<v-icon small right>card_giftcard</v-icon></v-btn
        >
        <v-dialog v-model="dialogDisplay" max-width="500">
          <v-card class="pa-3">
            <div v-if="dialogKey == 1">
              <v-card-title>
                <span class="grey--text">Input Receiver Address.</span>
              </v-card-title>
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
              <v-card-title>
                <span class="grey--text">Input Price. It will be sold with {{ computeFee() }}% fee. </span>
              </v-card-title>
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
              <v-card-title>
                <span class="grey--text">Please Approve Token Transfer Before Selling.</span>
              </v-card-title>
            </div>
            <div v-if="dialogKey == 4">
              <v-card-title>
                <span class="grey--text">Please Confirm Transaction on Web3 Wallet.</span>
              </v-card-title>
            </div>
            <div v-if="dialogKey == 5">
              <v-card-title>
                <span class="grey--text">Please Confirm Transaction by Signature.</span>
              </v-card-title>
            </div>
            <div v-if="dialogKey == 6">
              <v-card-title>
                <span class="grey--text">Please Check Transaction on <a :href="etherscan">Etherscan.</a></span>
              </v-card-title>
            </div>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

const networkIdToexceptions = {
  1: {
    '0x06012c8cf97bead5deae237070f9587f8e7a266d': [
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
    ],
    '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1': [
      {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'entityIndexToApproved',
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
  },
  4: {
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
    ],
    '0x587ae915d4ccaa5c2220c638069f2605e1f7404c': [
      {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'entityIndexToApproved',
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
}

const blockbaseAddress = '0xf9b744152a6897198b9B9999d8d340b59807595E'

const addressToFeeRatio = {
  '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1': 1000,
  '0x273f7f8e6489682df756151f5525576e322d51a3': 1000,
  '0xdceaf1652a131f32a821468dc03a92df0edd86ea': 1000
}

const addressToFeeRecipient = {
  '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1': '0x5926824315aF6016f98E83De841C5B28b959DF51',
  '0x273f7f8e6489682df756151f5525576e322d51a3': '0x070c22f0887bd1836A1E7C9ae0cd88108e0ECB19',
  '0xdceaf1652a131f32a821468dc03a92df0edd86ea': '0x070c22f0887bd1836A1E7C9ae0cd88108e0ECB19'
}

const defaultRatio = 500
const feeBase = 10000

const exceptions = networkIdToexceptions[process.env.NETWORK_ID || 4]

const contracts = {}

@Component
export default class Buttons extends Vue {
  dialogDisplay = false
  dialogKey = 0
  giftToAddress = ''
  takerAssetAmount = 0
  etherscan = ''

  @Prop() asset
  computeFee() {
    if (addressToFeeRatio[this.asset.asset_contract.address]) {
      return addressToFeeRatio[this.asset.asset_contract.address] / 100
    } else {
      return defaultRatio / 100
    }
  }
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
  async executeGift() {
    this.openDialog(4)
    const txhash = await this.$satellites.gift(
      this.asset.asset_contract.address,
      this.giftToAddress,
      this.$store.state.address,
      this.asset.token_id
    )
    this.etherscan = `https://etherscan.io/tx/${txhash}`
    this.openDialog(6)
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
    location.reload()
  }

  async executeApprove() {
    this.openDialog(3)
    if (!exceptions[this.asset.asset_contract.address]) {
      const txhash = await this.$satellites.erc721Token.setApprovalForAllAsync(
        this.asset.asset_contract.address,
        this.$store.state.address,
        this.$satellites.contractAddresses.erc721Proxy,
        true
      )
      this.etherscan = `https://etherscan.io/tx/${txhash}`
      this.openDialog(6)
    } else {
      const name = exceptions[this.asset.asset_contract.address][1].name
      if (!contracts[this.asset.asset_contract.address]) {
        const contract = new this.$web3.eth.Contract(
          exceptions[this.asset.asset_contract.address],
          this.asset.asset_contract.address
        )
        contracts[this.asset.asset_contract.address] = contract
      }
      const self = this
      await contracts[this.asset.asset_contract.address].methods[name](
        this.$satellites.contractAddresses.erc721Proxy,
        this.asset.token_id
      )
        .send({ from: this.$store.state.address })
        .on('transactionHash', function(txhash) {
          self.etherscan = `https://etherscan.io/tx/${txhash}`
          self.openDialog(6)
        })
    }
  }

  async executeBuy() {
    this.openDialog(4)
    let recipients: string[] | undefined
    let fees: string[] | undefined
    if (addressToFeeRatio[this.asset.asset_contract.address]) {
      const feeRatio = addressToFeeRatio[this.asset.asset_contract.address] / feeBase
      const fee = this.asset.order.takerAssetAmount.times(feeRatio)
      const actualFee = fee.div(2)
      recipients = [addressToFeeRecipient[this.asset.asset_contract.address], blockbaseAddress]
      fees = [actualFee, actualFee]
    } else {
      const feeRatio = defaultRatio / feeBase
      const fee = this.asset.order.takerAssetAmount.times(feeRatio)
      recipients = [blockbaseAddress]
      fees = [fee]
    }
    const txhash = await this.$satellites.buy(this.$store.state.address, this.asset.order, recipients, fees)
    this.etherscan = `https://etherscan.io/tx/${txhash}`
    this.openDialog(6)
  }

  async executeCancel() {
    this.openDialog(4)
    const txhash = await this.$satellites.cancel(this.asset.order)
    this.etherscan = `https://etherscan.io/tx/${txhash}`
    this.openDialog(6)
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
