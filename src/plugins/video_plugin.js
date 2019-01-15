import Plugin from '../plugin'
import $ from 'jquery'
import './export.scss'

class VideoPlugin extends Plugin {
  static name() {
    return '播放视频'
  }

  static attributes() {
    return super.attributes().concat([
      { label: '视频URL(mp4格式)', name: 'mp4Url', input: 'Text', required: true},
      { label: '视频URL(webm格式)', name: 'webmUrl', input: 'Text', required: true}
    ])
  }

  constructor({mp4Url, webmUrl} = {}) {
    super()
    this.mp4Url = mp4Url
    this.webmUrl = webmUrl
  }

  clicked() {
    const $html = $(`
      <div class="clickable-plugin__mask">
        <video controls loop autoplay class="clickable-plugin__video">
          <source src="${this.mp4Url}" type="video/mp4">
          <source src="${this.webmUrl}" type="video/webm">
        </video>
      </div>
    `).appendTo('body')
    const close = () => {
      $html.remove()
      $(document).off('.clickableVideoPlugin')
    }
    $html.one('click.clickableVideoPlugin', close)
    $(document).one('keydown.clickableVideoPlugin', (e) => {
      if (e.keyCode == 27) close()
    })
  }

  exportCode() {
    if (this.newTab) {
      return `window.open("${this.url}", '_blank');`
    } else {
      return `location.href = "${this.url}";`
    }
  }
}

export default Plugin.register('VideoPlugin', VideoPlugin)
