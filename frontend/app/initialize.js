function getStaticPath (filename) {
  return 'static/' + filename
}
window.getStaticPath = getStaticPath

function getImagePath (filename) {
  return getStaticPath('images/' + filename)
}
window.getImagePath = getImagePath


document.addEventListener('DOMContentLoaded', function () {
  window.Data = require('./data')

  const YokoPark = require('./YokoPark')
  window.YokoPark = YokoPark

  YokoPark.getJson(getStaticPath('textures.json'), function (data) {
    window.TextureData = data
    YokoPark.init()
  })
})
