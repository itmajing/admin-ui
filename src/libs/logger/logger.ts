import { LoggerObject, LoggerOption } from './types/logger';

class AuLogger implements LoggerObject {
  level = 'level';

  constructor(options: LoggerOption = { level: 'info' }) {
    if (options.level) {
      this.level = options.level;
    }
  }

  info(msg: any) {
    console.info(msg);
  }

  warn(msg: any) {
    console.warn(msg);
  }

  error(msg: any) {
    console.error(msg);
  }
}

export default AuLogger;
