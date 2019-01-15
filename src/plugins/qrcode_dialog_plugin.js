import Plugin from '../plugin'
import $ from 'jquery'
import './export.scss'
import { getParamsStr } from '../export_utils'

class QrcodeDialogPlugin extends Plugin {

  static name() {
    return '二维码弹窗'
  }

  static attributes() {
    return super.attributes().concat([
      { label: '二维码图片链接', name: 'qrcodeImage', input: 'Text', required: true},
      { label: '二维码参数名称', name: 'paramNames', input: 'Text', required: true, hint: '多个参数用英文逗号分隔'}
    ])
  }

  constructor({qrcodeImage, paramNames} = {}) {
    super()
    this.qrcodeImage = qrcodeImage
    this.paramNames = paramNames
  }

  clicked() {
    let selectParam = null
    if (this.paramNames) {
      selectParam = this.paramNames.split(',').map((paramName) => {
        return paramName.trim()
      });
    }
    const paramsString = getParamsStr(selectParam)
    const qrcodeImage = this.qrcodeImage.indexOf('?') !== -1 ?
      this.qrcodeImage + paramsString : `${this.qrcodeImage}?${paramsString}`

    const $html = $(`
      <div class="clickable-plugin__mask">
        <div class="clickable-plugin__qrcode-dialog__qrcode">
          <img class="clickable-plugin__qrcode-dialog__qrcode-background"
               src="https://m.xiguacity.cn/static/landing/program-add-qr.png" id="qrcontainer">
          <img class="clickable-plugin__qrcode-dialog__qrcode-image"
               src="${qrcodeImage}" id="clickable-qrcode__image">
          <i class="clickable-plugin__qrcode-dialog__qrcode-close-btn"></i>
        </div>
      </div>
    `).appendTo('body')

    const close = function() {
      $html.remove()
      $(document).off('.clickableQrcodeDialogPlugin')
    }
    $html.on('click', 'i', close)
    $(document).one('keydown.videoPluginClickable', (e) => {
      if (e.keyCode == 27) close()
    })
  }

  exportCode() {
    let selectParam = null
    if (this.paramNames) {
      selectParam = this.paramNames.split(',').map((paramName) => {
        return paramName.trim()
      });
    }
    const paramsString = getParamsStr(selectParam)
    const qrcodeImage = this.qrcodeImage.indexOf('?') !== -1 ?
      this.qrcodeImage + paramsString : `${this.qrcodeImage}?${paramsString}`

    return `
      var $html = $('<div class="clickable-plugin__mask">
        <div class="clickable-plugin__qrcode-dialog__qrcode">
          <img class="clickable-plugin__qrcode-dialog__qrcode-background"
               src="https://m.xiguacity.cn/static/landing/program-add-qr.png" id="qrcontainer">
          <img class="clickable-plugin__qrcode-dialog__qrcode-image"
               src="${qrcodeImage}" id="clickable-qrcode__image">
          <i class="clickable-plugin__qrcode-dialog__qrcode-close-btn"></i>
        </div>
      </div>
      ').appendTo('body');
      var close = function() {
        $html.remove();
        $(document).off('.clickableQrcodeDialogPlugin');
      };
      $html.on('click', 'i', close);
      $(document).one('keydown.videoPluginClickable', (e) => {
        if (e.keyCode == 27) close();
      });
    `.split('\n').join()
  }

}

export default Plugin.register('QrcodeDialogPlugin', QrcodeDialogPlugin)
