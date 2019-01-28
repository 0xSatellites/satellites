<template>
  <div>
    <line-chart :chart-data="datacollection"></line-chart>
  </div>
</template>

<script>
import db from '~/plugins/db'
import LineChart from '~/plugins/linechart'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null
    }
  },
  mounted: async function() {
    const prams = this.$route.params
    const history = await db.getOrderHistoryByType(prams.id.substring(0,4))
    this.datacollection = {
      labels: history.labels,
      datasets: [
        {
          label: '価格の推移',
          data: history.total_prices
        }
      ]
    }
  }
}
</script>