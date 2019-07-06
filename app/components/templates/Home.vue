<template>
  <TopVisual></TopVisual>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TopVisual from '~/components/organisms/TopVisual.vue'

@Component({
  components: {
    TopVisual
  }
})
export default class Home extends Vue {}
</script>
