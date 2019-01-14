class Area {
  constructor($ele) {
    this.$ele = $ele
    this.coordinates = {}
    $ele.data('instance', this)
    this.$ele.on('mousedown.clickable', (e) => {
      e.stopPropagation()
      return false
    })
  }

  setPlugin(plugin) {
    this.plugin = plugin
    this.$ele.on('click', (e) => {
      this.plugin.clicked()
    })
  }

  exportCode() {
    const html = this.$ele.wrap('<div>').parent().html()
    debugger
    return `
      var div = document.createElement('div');
      div.innerHTML = '${html}'.trim();
      var area = div.firstChild;
      area.addEventListener('click', function() {
        ${this.plugin.exportCode()}
      })
    `
  }

  setCoordinates({top, left, width, height}) {
    this.coordinates = {top, left, width, height}
    this.$ele.css({
      top: top * 100 + '%',
      left: left * 100 + '%',
      width: width * 100 + '%',
      height: height * 100 + '%'
    })
  }

  destroy() {
    this.$ele.remove()
  }
}

export default Area
