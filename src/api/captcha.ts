import { AuApi } from '@/api/utils'
import { AuAxios } from '@/libs/axios'

const CAPTCHA_MAIL: AuApi = {
  url: 'api/captcha/mail',
  method: 'POST',
}

const CAPTCHA_MOBILE: AuApi = {
  url: 'api/captcha/mobile',
  method: 'POST',
}

export interface Options {
  receiver: string
  operation: string
}

export function sendMailCaptcha(options: Options) {
  return AuAxios.request({
    ...CAPTCHA_MAIL,
    data: options,
  })
}

export function sendMobileCaptcha(options: Options) {
  return AuAxios.request({
    ...CAPTCHA_MOBILE,
    data: options,
  })
}
