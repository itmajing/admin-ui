import Vue from 'vue'

interface LoggerOption {
  level?: 'error' | 'warn' | 'info' | 'debug' | 'trace'
}

interface LoggerObject {
  info(msg: any): void
  warn(msg: any): void
  error(msg: any): void
}

declare module 'vue/types/vue' {
  interface Vue {
    $logger: LoggerObject
  }
}
