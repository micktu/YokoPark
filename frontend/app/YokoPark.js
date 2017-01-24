let textureOptions
let container, renderer, stage
let Preloader, Map, UI, Input
let lastFrameTime

function init() {
  container = document.querySelector('.map-container')

  PIXI.settings.MIPMAP_TEXTURES = false
  renderer = PIXI.autoDetectRenderer(980, 700)

  const extensions = PIXI.compressedTextures.detectExtensions(renderer);
  PIXI.loader.pre(PIXI.compressedTextures.extensionChooser(extensions))
  //textureOptions = { metadata: { choice: ['.pvr'] } }
  textureOptions = { metadata: { choice: [] } }

  Preloader = require('./Preloader')
  Preloader.init(container.querySelector('.preloader'))

  Map = require('./Map')
  Map.init(container)

  UI = require('./UI')
  UI.init(container.querySelector('.ui'))

  Input = require('./Input')
  Input.init(container)

  PIXI.loader.load(function () {
    onAssetsLoaded()
  })
}

function onAssetsLoaded() {
  container.appendChild(renderer.view)

  stage = new PIXI.Container()
  Map.onAssetsLoaded(stage)
  UI.onAssetsLoaded(stage)

  Preloader.hide()

  window.requestAnimationFrame(render)
}

function render(time) {
  if (lastFrameTime) {
    const deltaTime = time - lastFrameTime
    Map.render(deltaTime)
    UI.render(deltaTime)
  }

  lastFrameTime = time

  renderer.render(stage)
  window.requestAnimationFrame(render)
}

function getJson(url, callback) {
  const request = new XMLHttpRequest()
  
  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const data = JSON.parse(this.responseText)
      callback(data)
    }
  }

  request.open('GET', url)
  request.send()
}

module.exports = {
  getJson,
  init,
  get renderer() { return renderer },
  get Map() { return Map },
  get UI() { return UI }
}