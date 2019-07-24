declare module '*.vue' {
  module 'vue/types/vue' {
    interface Vue {
      $satellites: any
      $web3: any
      $exceptions: any
    }
  }
}
