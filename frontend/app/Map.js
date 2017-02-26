const AnimManager = require('./AnimManager')
const LocManager = require('./LocManager')
const YokoManager = require('./YokoManager')

let container, tileContainer, mapGraphics, backContainer, frontContainer, hintContainer
let animManager, locManager, yokoManager
let isDragging, dragX, dragY, dragMapX, dragMapY, oldX, oldY, velocityX, velocityY, hoverX, hoverY, viewportBounds
const friction = 0.8

function init(c, stage) {
  container = c

  TextureData.map.texturesPerX = Math.ceil(TextureData.map.width * TextureData.scale / TextureData.map.textureSize)
  TextureData.map.texturesPerY = Math.ceil(TextureData.map.height * TextureData.scale / TextureData.map.textureSize)
  TextureData.map.numTiles = TextureData.map.texturesPerX * TextureData.map.texturesPerY

  for (let i = 0; i < TextureData.map.numTiles; i++) {
    var mapName = TextureData.map.name + i
    PIXI.loader.add(mapName, 'images/textures/' + mapName + '.png', YokoPark.textureOptions)
  }

  tileContainer = new PIXI.Container()
  stage.addChild(tileContainer)
  
  animManager = new AnimManager(tileContainer)
  locManager = new LocManager(tileContainer)
  yokoManager = new YokoManager(tileContainer)
}

function onAssetsLoaded(stage) {
  var renderer = YokoPark.renderer

  for (var i = 0; i < TextureData.map.numTiles; i++) {
    var mapTexture = PIXI.loader.resources[TextureData.map.name + i].texture
    var mapSprite = new PIXI.Sprite(mapTexture)

    mapSprite.x = TextureData.map.textureSize * (i % TextureData.map.texturesPerX)
    mapSprite.y = TextureData.map.textureSize * Math.floor(i / TextureData.map.texturesPerX)

    tileContainer.addChild(mapSprite)
    renderer.textureManager.updateTexture(mapTexture)
  }

  const x = -(TextureData.map.width * TextureData.scale - renderer.width) / 2
  const y = -(TextureData.map.height * TextureData.scale - renderer.height) / 2
  moveViewport(x, y)

  animManager.onAssetsLoaded(stage)
  locManager.onAssetsLoaded()

  yokoManager.container = animManager.backContainer // FIXME
  yokoManager.onAssetsLoaded()
}

function render(deltaTime, time) {
  const c = tileContainer
  
  if (isDragging) {
    velocityX = c.x - oldX
    velocityY = c.y - oldY

    oldX = c.x
    oldY = c.y
  }
  else if (velocityX * velocityX + velocityY * velocityY > 1) {
    moveViewport(c.x + velocityX, c.y + velocityY)

    velocityX *= friction
    velocityY *= friction
  }

  locManager.render(deltaTime, time)
  animManager.render(deltaTime, time)
  yokoManager.render(deltaTime, time)
}

function mouseDown(x, y) {
  var c = tileContainer
  dragMapX = c.x
  dragMapY = c.y

  dragX = x
  dragY = y

  isDragging = true
}

function mouseUp(x, y) {
  isDragging = false

  // @hack to make counter area unclickable on map
  const view = YokoPark.renderer.view
  if (x < 130 && y > view.height - 80) return

  var dx = x - dragX
  var dy = y - dragY

  if (dx * dx + dy * dy < 100) {
    handleClick(x, y)
  }
}

function mouseMove(x, y) {
  if (!tileContainer) return

  if (!isDragging) {
    var body = document.body
    hoverX = x + body.scrollLeft - container.offsetLeft - tileContainer.x
    hoverY = y + body.scrollTop - container.offsetTop - tileContainer.y
    return
  }

  moveViewport(dragMapX - dragX + x, dragMapY - dragY + y)
}

function moveViewport(x, y) {
  var renderer = YokoPark.renderer
  var c = tileContainer

  // Update position
  c.x = x
  c.y = y

  // Clamp bounds
  var mapWidth = TextureData.map.width * TextureData.scale
  var mapHeight = TextureData.map.height * TextureData.scale

  if (c.x > 0) c.x = 0
  else if (c.x < renderer.width - mapWidth)
    c.x = renderer.width - mapWidth

  if (c.y > 0) c.y = 0
  else if (c.y < renderer.height - mapHeight)
    c.y = renderer.height - mapHeight

  // Cache bounds
  viewportBounds = new PIXI.Rectangle(-c.x, -c.y, -c.x + renderer.width, -c.y + renderer.height)
}

function handleClick(x, y) {
  var body = document.body

  var mapX = x + body.scrollLeft - container.offsetLeft - tileContainer.x
  var mapY = y + body.scrollTop - container.offsetTop - tileContainer.y

  if (YokoPark.UI.handleClick(mapX, mapY)) return
  if (yokoManager.handleClick(mapX, mapY)) return
  if (locManager.handleClick(mapX, mapY)) return
  
  animManager.click(mapX, mapY)
}

function viewportContains(x, y) {
  const b = viewportBounds
  return b.left <= x && b.top <= y && b.right >= x || b.bottom >= y
}

module.exports = {
  init,
  onAssetsLoaded,
  render,
  mouseDown,
  mouseUp,
  mouseMove,
  viewportContains,
  get animManager() { return animManager },
  get yokoManager() { return yokoManager },
  get hoverX() { return hoverX },
  get hoverY() { return hoverY }
}
