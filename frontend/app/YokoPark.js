let textureOptions
let container, renderer, stage
let Preloader, Map, UI, Input, Sound
let lastFrameTime

function init() {
  container = document.querySelector('.map-container')

  PIXI.settings.MIPMAP_TEXTURES = false
  PIXI.settings.PRECISION = PIXI.PRECISION.HIGH
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  renderer = PIXI.autoDetectRenderer(980, 700)

  container.appendChild(renderer.view)
  stage = new PIXI.Container()

  const extensions = PIXI.compressedTextures.detectExtensions(renderer);
  PIXI.loader.pre(PIXI.compressedTextures.extensionChooser(extensions))
  //textureOptions = { metadata: { choice: ['.pvr'] } }
  textureOptions = { metadata: { choice: [] } }

  Preloader = require('./Preloader')
  Preloader.init(container.querySelector('.preloader'))

  Map = require('./Map')
  Map.init(container, stage)

  const _UI = require('./UI')
  UI = new _UI(container.querySelector('.ui'));

  Input = require('./Input')
  Input.init(container)

  const _Sound = require('./Sound')
  Sound = new _Sound()

  PIXI.loader.load(function () {
    onAssetsLoaded()
  })
}

function onAssetsLoaded() {
  UI.onAssetsLoaded(stage)
  Map.onAssetsLoaded(stage)

  Preloader.hide()

  window.requestAnimationFrame(render)
}

function render(time) {
  if (lastFrameTime) {
    const deltaTime = time - lastFrameTime
    Map.render(deltaTime, time)
    //UI.render(deltaTime, time)
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
  get UI() { return UI },
  get Sound() { return Sound }
}