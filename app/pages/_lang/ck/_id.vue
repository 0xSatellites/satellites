<template>
  <div>
    <id></id>
  </div>
</template>
<script>
import id from '~/components/id'
import firestore from '~/plugins/firestore'
import axios from 'axios'

const config = require('../../../config.json')
const project = process.env.project

export default {
  components: {
    id
  },
  head() {
    return {
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.$t('meta.title') },
        { hid: 'og:description', property: 'og:description', content: this.$t('meta.description') }
      ]
    }
  },
  async asyncData({ store, params, route, error }) {
      const routeNames = route.name.split('-')
      let assetType
      if (routeNames[0] == 'lang') assetType = routeNames[1]
      else assetType = routeNames[0]
      const response = await axios.get(config.functions[project] + 'metadata?asset=' + assetType + '&id=' + params.id)
      store.dispatch('asset/setAsset', response.data)
  },
  computed: {
    asset() {
      return this.$store.getters['asset/asset']
    }
  }
}
</script>