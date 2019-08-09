<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card class="pa-3">
      <v-card-title>
        <span class="grey--text">Something is wrong... Please try later.</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="reload">
          Reload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Buttons extends Vue {
  dialog = true
  reload() {
    location.reload()
  }
}
</script>
