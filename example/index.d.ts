declare module '*.vue' {
  module 'vue/types/vue' {
    interface Vue {
      $config: any
      $satellites: any
      $web3: any
      $exceptions: any
    }
  }
}
