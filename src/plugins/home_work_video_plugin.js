import VideoPlugin from './video_plugin'
import $ from 'jquery'
import './export.scss'

class HomeWorkVideoPlugin extends VideoPlugin {
  static name() {
    return '播放作业视频'
  }

  static attributes() {
    return super.attributes().concat([
      { label: '老师点评', name: 'marvinComment', input: 'Text', required: true}
    ])
  }

  constructor({mp4Url, webmUrl, marvinComment} = {}) {
    super({mp4Url, webmUrl})
    this.marvinComment = marvinComment
  }

  clicked(area) {
    const $html = $(`
      <div class="clickable-plugin__mask">
        <div class="clickable-plugin__homework-wrapper">
          <video controls loop autoplay class="clickable-plugin__video">
            <source src="${this.mp4Url}" type="video/mp4">
            <source src="${this.webmUrl}" type="video/webm">
          </video>
          <p>肖恩老师点评</p>
          <div class="clickable-plugin__homework-comment">
            <div class="avatar"><img src="https://m.xiguacity.cn/static/landing/shawn-landing.png" /></div>
            <div class="comment">${this.marvinComment}</div>
          </div>
        </div>
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

  exportClickedCode() {
    return `
      var $html = $('
        <div class="clickable-plugin__mask">
          <div class="clickable-plugin__homework-wrapper">
            <video controls loop autoplay class="clickable-plugin__video">
              <source src="${this.mp4Url}" type="video/mp4">
              <source src="${this.webmUrl}" type="video/webm">
            </video>
            <p>肖恩老师点评</p>
            <div class="clickable-plugin__homework-comment">
              <div class="avatar"><img src="https://m.xiguacity.cn/static/landing/shawn-landing.png" /></div>
              <div class="comment">${this.marvinComment}</div>
            </div>
          </div>
        </div>
      ').appendTo('body');

      var close = function() {
        $html.remove();
        $(document).off('.clickableVideoPlugin');
      };
      $html.one('click.clickableVideoPlugin', close);
      $(document).one('keydown.clickableVideoPlugin', function(e) {
        if (e.keyCode == 27) close();
      });
    `.split('\n').join('')
  }
}

export default VideoPlugin.register('HomeWorkVideoPlugin', HomeWorkVideoPlugin)
