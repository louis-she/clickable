class Area {
  constructor($ele) {
    this.$ele = $ele
    this.coordinates = {}
    this.$ele.on('mousedown.clickable', (e) => {
      e.stopPropagation()
      return false
    })
    $ele.data('instance', this)
  }

  applyAction(plugin) {
    this.plugin = plugin
    if (plugin.set) {
      plugin.set(this)
    }

    if (plugin.clicked) {
      this.$ele.on('click', (e) => {
        this.plugin.clicked(this)
      })
    }
  }

  exportCode() {
    const style = Object.assign(this.coordinates, {
      cursor: 'pointer',
      position: 'absolute'
    })
    const styleString = Object.keys(style).map((key) => {
      return `${key}: ${style[key]}`
    }).join(';')

    return `
      var area = document.createElement('div');
      area.setAttribute("style", "${styleString}");
      ${this.plugin.exportSetCode && this.plugin.exportSetCode()}
      ${this.plugin.exportClickedCode && `area.addEventListener('click', function() {
        ${this.plugin.exportClickedCode()}
      })`}
    `
  }

  setCoordinates({top, left, width, height}) {
    this.coordinates = {
      top: `${top * 100}%`,
      left: `${left * 100}%`,
      width: `${width * 100}%`,
      height: `${height * 100}%`
    }
    this.$ele.css(Object.assign(this.coordinates, {
      cursor: 'pointer',
      position: 'absolute'
    }))
  }

  destroy() {
    this.$ele.remove()
  }
}

export default Area
