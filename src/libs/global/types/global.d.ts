import Vue from 'vue'

interface GlobalObject {
  url: {
    api: string
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $global: GlobalObject
  }
}
