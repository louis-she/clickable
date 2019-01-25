import Container from './container'
import $ from 'jquery'
import './index.scss';
import Area from './area'
import BottomFixedQrcodePlugin from './plugins/bottom_fixed_qrcode_plugin'
import { pluginFormDialog } from './dynamic_form'

$.extend(window, { $ })

let selecting = false;
let containersSelectors = []
let containers = []


// fixed的area一定是body的子元素，不属于任何contrainer，需要单独导出
function exportFixedCAreaCode() {
  let code = 'var container = $("body");'
  $('body > .clickable-area').each((_, area) => {
    code += $(area).data('instance').exportCode()
    code += `container.append(area);`
  })
  return code
}


function exportCode(containers) {
  const javascripts = require('!!raw-loader!./plugins/export.js').replace(/import/g, '// import').replace(/export/g, '')
  const styles = require('!!raw-loader!./plugins/export.scss')

  let code = ""
  code += `<style>${styles}</style>`
  code += `<script>${javascripts}</script>`
  code += `<script> window.onload = function() {`
  containers.forEach((container) => { code += container.exportCode() })
  code += exportFixedCAreaCode()
  code += `}; </script>`
  return code
}

if (chrome.runtime) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request.clickable === true) return;

    if (request.command === 'start' && selecting === false) {
      $('body').addClass('clickable-selecting')
      selecting = true
      if (containersSelectors.indexOf(request.containerSelector) === -1) {
        containersSelectors.push(request.containerSelector)
        $(request.containerSelector).each((_, ele) => {
          containers.push(new Container($(ele)))
        })
      }
      containers.forEach(container => container.on())
    } else if (request.command === 'stop' && selecting === true) {
      $('body').removeClass('clickable-selecting')
      selecting = false
      containers.forEach(container => container.off())
    } else if (request.command == 'export') {
      const code = exportCode(containers)
      const link = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([code], {type: 'text/plain'}))
      link.setAttribute('href', url)
      link.setAttribute('download', 'export.txt')
      link.click()
    } else if (request.command === 'create-bottom-area') {
      const area = new Area($('<div class="clickable-area"></div>'))
      $('body').append(area.$ele)
      area.setCoordinates({position: 'fixed', bottom: 0, left: 0, right: 0})
      pluginFormDialog(area, BottomFixedQrcodePlugin)
    }
  })
} else {
  $('.slide').each((_, slide) => {
    new Container($(slide)).on();
  });

  // const area = new Area($('<div class="clickable-area"></div>'))
  // $('body').append(area.$ele)
  // area.setCoordinates({position: 'fixed', bottom: 0, left: 0, right: 0})
  // pluginFormDialog(area, BottomFixedQrcodePlugin)
}
