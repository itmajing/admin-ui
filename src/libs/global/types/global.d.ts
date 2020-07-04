import Vue from 'vue'

interface GlobalObject {
  httpBaseUrl:string
}

declare module 'vue/types/vue' {
  interface Vue {
    $global: GlobalObject
  }
}
