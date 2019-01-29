<template>
  <div>
    <section class="c-price">
      <h2 class="c-price__title">価格推移</h2>
      <line-chart :chart-data="datacollection"></line-chart>
    </section>
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