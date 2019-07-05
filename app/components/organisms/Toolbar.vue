<template>
  <v-toolbar clipped-left fixed app>
    <v-btn icon @click="drawer = !drawer">
      <v-icon>menu</v-icon>
    </v-btn>
    <v-toolbar-title v-text="title" />
  </v-toolbar>
</template>

<script lang="ts">
//  import { Component, Prop, Vue } from 'vue-property-decorator'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Toolbar extends Vue {
  // @Prop() drawer!: boolean
  drawer: boolean = true
  title: String = 'Bazaaar.io'
}
</script>
