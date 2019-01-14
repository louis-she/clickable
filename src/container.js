import $ from "jquery";
import swal from 'sweetalert2';
import Area from './area'
import RedirectPlugin from './plugins/redirect_plugin'
import Plugin from './plugin'

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
        const width = (mouseX - anchorX) / $containerWidth
        const height = (mouseY - anchorY) / $containerHeight
        const left = (width < 0 ? mouseX : anchorX) / $containerWidth
        const top = (height < 0 ? mouseY : anchorY) / $containerHeight

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
        swal({
          title: "配置点击行为",
          html: this.renderForm(RedirectPlugin.attributes()),
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '添加',
          cancelButtonText: '取消',
          customClass: 'clickable-dialog',
          preConfirm: () => {
            let attr = {}
            $('#clickable-form').serializeArray().forEach((data) => {
              attr[data.name] = data.value
            })
            console.log("Plugin initialized with: ", attr)
            area.setPlugin(new Plugin.registedPlugins[attr.pluginType](attr))
          }
        }).then((result) => {
          $('body').removeClass('clickable-form-editing')
          if (result.value) {
          } else {
            area.destroy()
          }
        })
      })
    })
  }

  createTextInput(attribute) {
    return `<input name="${attribute.name}" type="text" ${attribute.required === true && 'required'}>`
  }

  createCheckboxInput(attribute) {
    return `<input name="${attribute.name}" type="checkbox">`
  }

  createSelectInput(attribute) {
    const options = attribute.options.map((option) => {
      return `<option value="${option.value}">${option.label}</option>`
    })
    return `<select name="${attribute.name}"> ${options.join()} </select>`
  }

  createField(attribute) {
    const inputMethod = `create${attribute.input}Input`
    return $(`
      <div class="clickable-form__field">
        <div class="clickable-form__field-label">${attribute.label}</div>
        <div class="clickable-form__field-input">
          ${this[inputMethod] ? this[inputMethod](attribute) : this.createTextInput(attribute)}
        </div>
      </div>
    `)
  }

  renderForm(attributes) {
    const $form = $('<form id="clickable-form" class="clickable-form" />')
    attributes.forEach(fieldAttribute => {
      const $field = this.createField(fieldAttribute)
      $form.append($field)
    });
    return $form.wrap('<div>').parent().html()
  }

  off() {
    this.$ele.off('.clickable')
  }
}

export default Container
