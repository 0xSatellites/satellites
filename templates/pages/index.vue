<template>
  <v-content>
    <section class="c-index">
      <v-container grid-list-md align-center justify-space-between>
        <v-layout row wrap justify-center>
          <v-flex v-for="token in this.$config.tokens" :key="token.contract" xs6 sm4>
            <a :href="`/market?address=${token.contract}`" target="_blank">
              <v-card flat class="ma-1">
                {{ token.name }}
                <!-- <v-img :src="require(`${token.logo}`)" aspect-ratio="1.2"></v-img> -->
              </v-card>
            </a>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Index extends Vue {}
</script>

<style></style>
