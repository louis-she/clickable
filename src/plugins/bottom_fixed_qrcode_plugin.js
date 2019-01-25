import Plugin from '../plugin'
import { getParamsStr, bottomScrollUp } from './export'
import $ from 'jquery'


class BottomFixedQrcodePlugin extends Plugin {
  static name() {
    return '底部二维码'
  }

  static configurable() {
    return false
  }

  static attributes() {
    return [
      { name: 'pluginType', label: '动作名称', input: 'Select', options: [{label: '底部二维码', value: 'BottomFixedQrcodePlugin'}]},
      { label: '图片链接', name: 'backgroundImage', input: 'Text' },
      { label: '二维码链接', name: 'qrcodeImage', input: 'Text' }
    ]
  }

  constructor({backgroundImage, qrcodeImage} = {}) {
    super()
    this.backgroundImage = backgroundImage
    this.qrcodeImage = qrcodeImage
  }

  set(area) {
    var paramsString = getParamsStr()
    var qrcodeImage = this.qrcodeImage.indexOf('?') !== -1 ?
      `${this.qrcodeImage}&${paramsString}` : `${this.qrcodeImage}?${paramsString}`
    var $element = $(`
      <div class="clickable-bottom-fixed-qrcode">
        <img class="clickable-bottom-fixed-qrcode__background" src="${this.backgroundImage}" />
        <img class="clickable-bottom-fixed-qrcode__qrcode" src="${qrcodeImage}" />
      </div>
    `)
    var timer;
    var scrollYMax = $(document).height() - $(window).height();
    window.addEventListener('scroll', function(e) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        if ((scrollY / scrollYMax) > 0.2) {
          $element.slideDown(function() {
            $element.css({
              display: 'flex',
              alignItems: 'baseline'
            })
          });
        } else {
          $element.slideUp();
        }
      }, 100);
    });
    area.$ele.append($element)
  }

  exportSetCode() {
    return `
      var paramsString = getParamsStr();
      var qrcodeImage = '${this.qrcodeImage}'.indexOf('?') !== -1 ?
        '${this.qrcodeImage}' + '&' + paramsString : '${this.qrcodeImage}' + '?' + paramsString;

      var $element = $(' \
        <div class="clickable-bottom-fixed-qrcode"> \
          <img class="clickable-bottom-fixed-qrcode__background" src="${this.backgroundImage}" /> \
          <img class="clickable-bottom-fixed-qrcode__qrcode" src="' + qrcodeImage + '" /> \
        </div> \
      ')

      var timer;
      var scrollYMax = $(document).height() - $(window).height();
      window.addEventListener('scroll', function(e) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
          if ((scrollY / scrollYMax) > 0.2) {
            $element.slideDown(function() {
              $element.css({
                display: 'flex',
                alignItems: 'baseline'
              })
            });
          } else {
            $element.slideUp();
          }
        }, 100);
      });
      $(area).append($element);
    `
  }
}

export default Plugin.register('BottomFixedQrcodePlugin', BottomFixedQrcodePlugin)
