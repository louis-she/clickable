import $ from "jquery";
import Area from './area'
import RedirectPlugin from './plugins/redirect_plugin'
import Plugin from './plugin'
import { pluginFormDialog } from './dynamic_form'

const context = require.context('./plugins/', true, /\.js$/)
context.keys().forEach(context)

class Container {
  constructor($ele) {
    this.$ele = $ele
    $ele.data('instance', this)
  }

  exportCode() {
    let code = `{`
    code += `var container = document.getElementsByClassName('${this.$ele.attr('class')}')[0];`
    this.$ele.find('.clickable-area').each((_, area) => {
      code += $(area).data('instance').exportCode()
      code += `container.appendChild(area)`
    })
    code += `}`

    return code
  }

  createArea() {
    const area = new Area($('<div class="clickable-area"></div>'))
    this.$ele.append(area.$ele)
    return area
  }

  on() {
    this.$ele.on('mousedown.clickable', (e) => {
      let shifted = false
      $(document).on('keydown.clickable keyup.clickable', (e) => {
        if (e.keyCode == 16) { shifted = !shifted }
      })

      this.$ele.addClass('clickable-selecting')
      const area = this.createArea()
      const $containerLeftOffset = this.$ele.offset().left
      const $containerTopOffset = this.$ele.offset().top
      const $containerHeight = this.$ele.height()
      const $containerWidth = this.$ele.width()
      const anchorX = e.pageX - $containerLeftOffset
      const anchorY = e.pageY - $containerTopOffset

      this.$ele.on('mousemove.clickable', function(e) {
        const mouseX = e.pageX - $containerLeftOffset
        const mouseY = e.pageY - $containerTopOffset

        let width, height, left, top = 0

        width = (mouseX - anchorX)
        height = (mouseY - anchorY)

        if (!shifted) {
          width = width / $containerWidth
          height = height / $containerHeight
          left = (width < 0 ? mouseX : anchorX) / $containerWidth
          top = (height < 0 ? mouseY : anchorY) / $containerHeight
        } else {
          const minBorder = Math.min(Math.abs(width), Math.abs(width))
          width = minBorder / $containerWidth
          height = minBorder / $containerHeight
          left = (width < 0 ? anchorX - minBorder : anchorX) / $containerWidth
          top = (height < 0 ? anchorY - minBorder : anchorY) / $containerHeight
        }

        area.setCoordinates({
          top,
          left,
          width: Math.abs(width),
          height: Math.abs(height)
        })
      })

      this.$ele.one('mouseup.clickable', () => {
        $('body').addClass('clickable-form-editing')
        this.$ele.off('mousemove.clickable')
        this.$ele.removeClass('clickable-selecting')
        pluginFormDialog(area, RedirectPlugin)
      })
    })
  }

  off() {
    this.$ele.off('.clickable')
  }
}

export default Container
