import { GlobalObject } from '@/libs/global/types/global'

class AuGlobal implements GlobalObject {
  url: { api: string }

  constructor() {
    const w = window as any
    this.url = {
      api: (w.g && w.g.api) || 'http://127.0.0.1:8090',
    }
  }
}

export default new AuGlobal()
