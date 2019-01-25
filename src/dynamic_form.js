import Plugin from './plugin'
import swal from 'sweetalert2';
import $ from 'jquery';


const context = require.context('./plugins/', true, /\.js$/)
context.keys().forEach(context)


const availableFields = {
  createTextInput(attribute) {
    return `<input name="${attribute.name}" type="text" placeholder="${attribute.hint || ''}"
        ${attribute.required === true && 'required'}>`
  },

  createCheckboxInput(attribute) {
    return `<input name="${attribute.name}" type="checkbox">`
  },

  createSelectInput(attribute) {
    const options = attribute.options.map((option) => {
      return `<option value="${option.value}">${option.label}</option>`
    })
    return `<select name="${attribute.name}"> ${options.join()} </select>`
  },

  createHiddenInput(attribute) {
    return `<input name="${attribute.name}" type="hidden", value="${attribute.value}">`
  }
}


function createField(attribute) {
  const inputMethod = `create${attribute.input}Input`
  return $(`
    <div class="clickable-form__field">
      <div class="clickable-form__field-label">${attribute.label}</div>
      <div class="clickable-form__field-input">
        ${availableFields[inputMethod] ? availableFields[inputMethod](attribute) : availableFields.createTextInput(attribute)}
      </div>
    </div>
  `)
}


function renderForm(attributes, pluginType="RedirectPlugin") {
  const $form = $('<form id="clickable-form" class="clickable-form" />')
  attributes.forEach(fieldAttribute => {
    const $field = createField(fieldAttribute)
    $form.append($field)
  });
  $form.find(`option[value=${pluginType}]`).attr('selected', true)
  return $form.wrap('<div>').parent().html()
}


export function pluginFormDialog(area, pluginClass) {
  swal({
    title: "配置行为",
    html: renderForm(pluginClass.attributes()),
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: '添加',
    cancelButtonText: '取消',
    customClass: 'clickable-dialog',
    onOpen: (modal) => {
      const $modal = $(modal)
      $modal.on('change.clickable', 'select[name=pluginType]', (e) => {
        const $selector = $(e.currentTarget)
        $modal.find('form').replaceWith(
          renderForm(Plugin.registedPlugins[$selector.val()].attributes(), $selector.val())
        )
      })
    },
    preConfirm: () => {
      let attr = {}
      $('#clickable-form').serializeArray().forEach((data) => {
        attr[data.name] = data.value
      })
      console.log("Plugin initialized with: ", attr)
      console.log(Plugin.registedPlugins)
      console.log(Plugin.registedPlugins[attr.pluginType])
      area.applyAction(new Plugin.registedPlugins[attr.pluginType](attr))
    }
  }).then((result) => {
    $('body').removeClass('clickable-form-editing')
    if (result.value) {
    } else {
      area.destroy()
    }
  })
}
