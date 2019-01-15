import Container from './container'
import $ from 'jquery'
import './index.scss';

let selecting = false;
let containersSelectors = []
let containers = []

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
      let code = `<script>
        function clickablePatchAreas() {
      `
      containers.forEach((container) => {
        console.log(container)
        code += container.exportCode()
      })
      code += ` };
        setTimeout(clickablePatchAreas, 1000);
      </script> `

      const link = document.createElement('a')
      const url = window.URL.createObjectURL(new Blob([code], {type: 'text/plain'}));
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.txt');
      link.click();
    }
  })
} else {
  $('.slide').each((_, slide) => {
    new Container($(slide)).on()
  })
}
