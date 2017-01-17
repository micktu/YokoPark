const SpriteAnim = require('./SpriteAnim')

let container, tileContainer
const spriteAnims = {}
const animatedYoko = []
let isDragging, dragX, dragY, dragMapX, dragMapY

function init(c) {
  container = c

  TextureData.map.texturesPerX = Math.ceil(TextureData.map.width * TextureData.scale / TextureData.map.textureSize)
  TextureData.map.texturesPerY = Math.ceil(TextureData.map.height * TextureData.scale / TextureData.map.textureSize)
  TextureData.map.numTiles = TextureData.map.texturesPerX * TextureData.map.texturesPerY

  for (let i = 0; i < TextureData.map.numTiles; i++) {
    var mapName = TextureData.map.name + i
    PIXI.loader.add(mapName, 'images/textures/' + mapName + '.jpg', YokoPark.textureOptions)
  }

  for (var name in TextureData.animations) {
    spriteAnims[name] = new SpriteAnim(name)
  }

  PIXI.loader.add('marker', 'images/layout/marker.png')
}

function onAssetsLoaded(stage) {
  tileContainer = new PIXI.Container()
  stage.addChild(tileContainer)

  var renderer = YokoPark.renderer

  for (var i = 0; i < TextureData.map.numTiles; i++) {
    var mapTexture = PIXI.loader.resources[TextureData.map.name + i].texture
    var mapSprite = new PIXI.Sprite(mapTexture)

    mapSprite.x = TextureData.map.textureSize * (i % TextureData.map.texturesPerX)
    mapSprite.y = TextureData.map.textureSize * Math.floor(i / TextureData.map.texturesPerX)

    tileContainer.addChild(mapSprite)
    renderer.textureManager.updateTexture(mapTexture)
  }

  tileContainer.x = -(TextureData.map.width * TextureData.scale - renderer.width) / 2
  tileContainer.y = -(TextureData.map.height * TextureData.scale - renderer.height) / 2

  var mapGraphics = new PIXI.Graphics()
  mapGraphics.lineStyle(2, 0x00FF00)
  tileContainer.addChild(mapGraphics)

  for (let name in spriteAnims) {
    spriteAnims[name].onAssetsLoaded()
  }

  for (var i = 0; i < Data.markers.length; i++) {
    var marker = Data.markers[i]

    var markerSprite = new PIXI.Sprite(PIXI.loader.resources.marker.texture)
    markerSprite.anchor.set(0.5, 1.0)
    markerSprite.position.set(marker.x * TextureData.scale, marker.y * TextureData.scale)
    markerSprite.scale.set(0.5, 0.5)
    tileContainer.addChild(markerSprite)
  }
}

function render(deltaTime) {
  for (var i = 0; i < animatedYoko.length; i++) {
    var yoko = animatedYoko[i]

    if (yoko.animationTime >= Data.yokoAnimationPeriod) {
      yokoCollected++
      counterNumber.innerHTML = '' + yokoCollected

      tileContainer.removeChild(yoko.sprite)
      yoko.sprite = null
      animatedYoko.splice(i, 1)
      i--
      continue
    }

    var t = yoko.animationTime / Data.yokoAnimationPeriod
    yoko.sprite.scale.set(yoko.scaleX * (1 + 0.5 * t), yoko.scaleY * (1 + 0.5 * t))
    yoko.sprite.alpha = 1 - t

    yoko.animationTime += deltaTime
  }
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

  var dx = x - dragX
  var dy = y - dragY

  if (dx * dx + dy * dy < 100) {
    handleClick(x, y)
  }
}

function mouseMove(x, y) {
  var c = tileContainer
  var renderer = YokoPark.renderer

  c.x = dragMapX - dragX + x
  c.y = dragMapY - dragY + y

  var mapWidth = TextureData.map.width * TextureData.scale
  var mapHeight = TextureData.map.height * TextureData.scale

  if (c.x > 0) c.x = 0
  else if (c.x < renderer.width - mapWidth)
    c.x = renderer.width - mapWidth

  if (c.y > 0) c.y = 0
  else if (c.y < renderer.height - mapHeight)
    c.y = renderer.height - mapHeight
}

function handleClick(x, y) {
  var body = document.body

  var mapX = x + body.scrollLeft - container.offsetLeft - tileContainer.x
  var mapY = y + body.scrollTop - container.offsetTop - tileContainer.y

  if (YokoPark.UI.handleClick(mapX, mapY)) return

  for (var i = 0; i < Data.yoko.length; i++) {
    break;
    var yoko = Data.yoko[i]

    if (yoko.isAnimated) continue

    var dX = x - yoko.x
    var dY = y - yoko.y

    if (dX * dX + dY * dY <= Data.yokoRadius * Data.yokoRadius) {
      var scale = yoko.sprite.scale
      yoko.scaleX = scale.x
      yoko.scaleY = scale.y
      yoko.isAnimated = true
      yoko.animationTime = 0
      animatedYoko.push(yoko)
      isCounterAnimated = true
      return
    }
  }

  for (let name in spriteAnims) {
    var anim = spriteAnims[name]

    if (anim.hit(mapX, mapY)) {
      anim.play()
      return
    }
  }
}

module.exports = {
  init,
  onAssetsLoaded,
  render,
  mouseDown,
  mouseUp,
  mouseMove,
  get tileContainer() { return tileContainer }
}
