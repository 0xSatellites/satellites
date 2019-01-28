<template>
  <div>
    <line-chart :chart-data="datacollection" id="myChart"></line-chart>
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
    const params = this.$route.params
    var history
    if(params.id){
      history = await db.getOrderHistoryByType(params.id.substring(0,4))
    } else if (params.hash) {
      const order = await db.getOrderByKey(params.hash)
      history = await db.getOrderHistoryByType(order.id.substring(0,4))
    }

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