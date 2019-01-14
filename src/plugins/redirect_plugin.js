import Plugin from '../plugin'

class RedirectPlugin extends Plugin {
  static name() {
    return '重定向'
  }

  static attributes() {
    return super.attributes().concat([
      { label: '跳转URL', name: 'url', input: 'Text', default: 'https://www.xiguacity.cn'},
      { label: 'newTab', name: 'newTab', input: 'Checkbox', default: true }
    ])
  }

  constructor({url, newTab} = {}) {
    super()
    this.url = url
    this.newTab = newTab
  }

  clicked() {
    if (this.newTab) {
      window.open(this.url, '_blank')
    } else {
      location.href = this.url
    }
  }

  exportCode() {
    if (this.newTab) {
      return `window.open("${this.url}", '_blank');`
    } else {
      return `location.href = ${this.url};`
    }
  }
}

export default Plugin.register('RedirectPlugin', RedirectPlugin)
