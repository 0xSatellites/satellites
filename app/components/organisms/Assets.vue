<template>
  <div class="container">
    assets comp
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Assets extends Vue {
  @Prop() assets!: String[]
}
</script>
