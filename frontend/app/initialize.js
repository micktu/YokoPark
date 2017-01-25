document.addEventListener('DOMContentLoaded', function () {
  window.Data = require('./data')

  const YokoPark = require('./YokoPark')
  window.YokoPark = YokoPark

  YokoPark.getJson('textures.json', function (data) {
    window.TextureData = data
    YokoPark.init()
  })
})
