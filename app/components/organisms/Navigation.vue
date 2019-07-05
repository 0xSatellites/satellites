<template>
  <v-navigation-drawer v-model="drawer" clipped app> </v-navigation-drawer>
</template>

<script lang="ts">
//  import { Component, Prop, Vue } from 'vue-property-decorator'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Navigation extends Vue {
  // @Prop() drawer!: boolean
  drawer: boolean = true
}
</script>
