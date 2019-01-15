import Plugin from '../plugin'
import './export.scss'
import { getParamsStr } from './export'

class QrcodePlugin extends Plugin {

  static name() {
    return '二维码图片'
  }

  static attributes() {
    return super.attributes().concat([
      { label: '二维码图片链接', name: 'qrcodeImage', input: 'Text', required: true}
    ])
  }

  constructor({qrcodeImage} = {}) {
    super()
    this.qrcodeImage = qrcodeImage
  }

  set(area) {
    const paramsString = getParamsStr()
    const qrcodeImage = this.qrcodeImage.indexOf('?') !== -1 ?
      `${this.qrcodeImage}&${paramsString}` : `${this.qrcodeImage}?${paramsString}`

    const $html = `
      <img src="${qrcodeImage}" style="width: 100%; height: 100%; opacity: 1;" />
    `
    area.$ele.html($html)
  }

  exportSetCode() {
    return `
      var paramsString = getParamsStr();
      var qrcodeImage = '${this.qrcodeImage}'.indexOf('?') !== -1 ?
        '${this.qrcodeImage}' + paramsString : '${this.qrcodeImage}' + '?' + paramsString;
      var html = '<img src="' + qrcodeImage + '" style="width: 100%; height: 100%;" />';
      area.innerHTML = html;
    `
  }

}

export default Plugin.register('QrcodePlugin', QrcodePlugin)
