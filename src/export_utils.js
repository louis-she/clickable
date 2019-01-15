import $ from 'jquery'

export function getParamsStr(selectParams = null) {
  if (location.search.indexOf('?') === -1) return ''
  const search = location.search.substring(1);
  const parameters = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  let result = {}
  if (selectParams instanceof Array) {
    selectParams.forEach((key) => {
      if (key in parameters) {
        result[key] = parameters[key]
      }
    })
  } else {
    result = parameters
  }
  return $.param(result)
}
