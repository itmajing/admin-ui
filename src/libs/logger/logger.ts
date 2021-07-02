import { LoggerObject, LoggerOption } from './types/logger';

const LOG_LEVEL = {
  debug: 0,
  info: 5,
  warn: 10,
  error: 15,
};

class AuLogger implements LoggerObject {
  level = 'info';
  value = LOG_LEVEL.info;

  constructor(options: LoggerOption = { level: 'info' }) {
    if (options.level) {
      this.level = options.level;
      this.value = LOG_LEVEL[options.level] || LOG_LEVEL.info;
    }
  }

  /* eslint-disable no-console */
  debug(...data: any[]): void {
    if (this.value === LOG_LEVEL.debug) {
      console.info(...data);
    }
  }

  info(...data: any[]): void {
    if (this.value <= LOG_LEVEL.info) {
      console.info(...data);
    }
  }

  warn(...data: any[]): void {
    if (this.value <= LOG_LEVEL.warn) {
      console.warn(...data);
    }
  }

  error(...data: any[]): void {
    if (this.value <= LOG_LEVEL.error) {
      console.error(...data);
    }
  }
  /* eslint-enable no-console */
}

export { AuLogger };

export default new AuLogger();
