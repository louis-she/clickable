import Container from './container'
import $ from 'jquery'
import './index.scss';

// function drawClickbleArea(wrapperClass) {
//   const $document = $(document)
//
//   const $wrappers = $(wrapperClass)
//
//   $wrappers.on('mousedown', (e) => {
//     const $wrapper = $(e.target)
//     const $wrapperLeftOffset = $wrapper.offset().left
//     const $wrapperTopOffset = $wrapper.offset().top
//     const $wrapperHeight = $wrapper.height()
//     const $wrapperWidth = $wrapper.width()
//
//     const $hintDiv = $('<div class="clickable-hint"></div>')
//     const anchorX = e.pageX - $wrapperLeftOffset
//     const anchorY = e.pageY - $wrapperTopOffset
//
//     $wrapper.append($hintDiv)
//
//     $document.on('mousemove', function(e) {
//       const mouseX = e.pageX - $wrapperLeftOffset
//       const mouseY = e.pageY - $wrapperTopOffset
//
//       const width = (mouseX - anchorX) / $wrapperWidth
//       const height = (mouseY - anchorY) / $wrapperHeight
//
//       console.log(anchorX, anchorY)
//       const left = (width < 0 ? mouseX : anchorX) / $wrapperWidth
//       const top = (height < 0 ? mouseY : anchorY) / $wrapperHeight
//
//       $hintDiv.css({
//         top: top * 100 + '%',
//         left: left * 100 + '%',
//         width: Math.abs(width) * 100 + '%',
//         height: Math.abs(height) * 100 + '%'
//       })
//     })
//
//     $document.one('mouseup', function(e) {
//       $document.off('mousemove')
//       $body.removeClass('selecting')
//       swal("填写表单" , "这里是表单")
//     })
//   })
// }

$('.slide').each((_, ele) => {
  new Container($(ele)).on()
})
