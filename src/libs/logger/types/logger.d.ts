import Vue from 'vue'

interface LoggerOption {
  level?: 'error' | 'warn' | 'info' | 'debug'
}

interface LoggerObject {
  debug(message?: any, ...optionalParams: any[]): void
  info(message?: any, ...optionalParams: any[]): void
  warn(message?: any, ...optionalParams: any[]): void
  error(message?: any, ...optionalParams: any[]): void
}

declare module 'vue/types/vue' {
  interface Vue {
    $logger: LoggerObject
  }
}
