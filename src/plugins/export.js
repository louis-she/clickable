// this file will be exported so do not use any es6 features but only the import and export
import $ from 'jquery'

export function getParamsStr(selectParams = null) {
  if (location.search.indexOf('?') === -1) return '';
  var search = location.search.substring(1);
  var parameters = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
  var result = {};
  if (selectParams instanceof Array) {
    selectParams.forEach(function(key) {
      if (key in parameters) {
        result[key] = parameters[key];
      }
    })
  } else {
    result = parameters;
  }
  return $.param(result);
}
