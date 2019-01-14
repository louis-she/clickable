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

  setPlugin(plugin) {
    this.plugin = plugin
    this.$ele.on('click', (e) => {
      this.plugin.clicked()
    })
  }

  exportCode() {
    const style = Object.assign(this.coordinates, {
      cursor: 'pointer',
      position: 'absolute',
      opacity: '0'
    })
    const styleString = Object.keys(style).map((key) => {
      return `${key}: ${style[key]}`
    }).join(';')

    return `
      var area = document.createElement('div');
      area.setAttribute("style", "${styleString}");
      area.addEventListener('click', function() {
        ${this.plugin.exportCode()}
      })
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
