<template>
    <line-chart :chart-data="datacollection" id="myChart"></line-chart>
</template>

<script>
import firestore from '~/plugins/firestore'
import LineChart from '~/plugins/linechart'

export default {
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: null
    }
  },
  mounted: async function() {
    const params = this.$route.params
    var histories
    if (params.id) {
      histories = await firestore.docs('order', 'asset_type', '==', params.id.substring(0, 4))
    } else if (params.hash) {
      const order = await firestore.doc('order', params.hash)
      histories = await firestore.docs('order', 'asset_type', '==', order.id.substring(0, 4))
    }
    const chart = {
      labels:[],
      prices:[]
    }
    for(var history of histories){
      chart.prices.push(history.price / 1000000000000000000)
      chart.labels.push('')
    }
    this.datacollection = {
      labels: chart.labels,
      datasets: [
        {
          label: '価格の推移',
          data: chart.prices
        }
      ]
    }
  }
}
</script>
<style scoped>

</style>

