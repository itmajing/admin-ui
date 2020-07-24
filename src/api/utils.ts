import { Method } from 'axios'

export interface AuApi {
  url: string
  method: Method
  headers?: object
}
