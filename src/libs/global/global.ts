import { GlobalObject } from '@/libs/global/types/global';

class AuGlobal implements GlobalObject {
  httpBaseUrl: string;

  constructor() {
    this.httpBaseUrl = process.env.VUE_APP_HTTP_BASE_URL;
  }
}

export default new AuGlobal();
