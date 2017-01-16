let container, tileContainer
let isDragging, dragX, dragY, dragMapX, dragMapY
let animatedYoko = []

function init(c) {
  container = c

  data.map.texturesPerX = Math.ceil(data.map.width * data.scale / data.map.textureSize)
  data.map.texturesPerY = Math.ceil(data.map.height * data.scale / data.map.textureSize)
  data.map.numTiles = data.map.texturesPerX * data.map.texturesPerY
  data.totalTextures = data.map.numTiles

  for (let i = 0; i < data.map.numTiles; i++) {
    var mapName = data.map.name + i
    PIXI.loader.add(mapName, 'images/textures/' + mapName + '.jpg', YokoPark.textureOptions)
  }

  for (var name in data.animations) {
    var anim = data.animations[name]

    var texSize = anim.textureSize || data.animTextureSize

    anim.framesPerX = Math.floor(texSize / (anim.width * data.scale))
    anim.framesPerY = Math.floor(texSize / (anim.height * data.scale))
    anim.framesPerTexture = anim.framesPerX * anim.framesPerY
    anim.numTextures = Math.ceil(anim.numFrames / anim.framesPerTexture)
    data.totalTextures += anim.numTextures

    for (let i = 0; i < anim.numTextures; i++) {
      PIXI.loader.add(name + i, 'images/textures/' + name + i + '.png', YokoPark.textureOptions)
    }
  }

  PIXI.loader.add('marker', 'images/layout/marker.png')
}

function onAssetsLoaded(stage) {
  tileContainer = new PIXI.Container()
  stage.addChild(tileContainer)

  var renderer = YokoPark.renderer

  for (var i = 0; i < data.map.numTiles; i++) {
    var mapTexture = PIXI.loader.resources[data.map.name + i].texture
    var mapSprite = new PIXI.Sprite(mapTexture)

    mapSprite.x = data.map.textureSize * (i % data.map.texturesPerX)
    mapSprite.y = data.map.textureSize * Math.floor(i / data.map.texturesPerX)

    tileContainer.addChild(mapSprite)
    renderer.textureManager.updateTexture(mapTexture)
  }

  tileContainer.x = -(data.map.width * data.scale - renderer.width) / 2
  tileContainer.y = -(data.map.height * data.scale - renderer.height) / 2

  var mapGraphics = new PIXI.Graphics()
  mapGraphics.lineStyle(2, 0x00FF00)
  tileContainer.addChild(mapGraphics)

  for (var name in data.animations) {
    var anim = data.animations[name]

    if (!anim.isBackground) {
      //mapGraphics.drawRect(anim.x * data.scale, anim.y * data.scale, anim.width * data.scale, anim.height * data.scale)
    }

    var w = anim.width * data.scale
    var h = anim.height * data.scale

    var prevTexture = -1
    var baseTexture

    var frames = []
    for (var i = 0; i < anim.numFrames; i++) {
      var currentTexture = Math.floor(i / anim.framesPerTexture)

      if (currentTexture !== prevTexture) {
        baseTexture = PIXI.loader.resources[name + currentTexture].texture.baseTexture
        renderer.textureManager.updateTexture(baseTexture)
        prevTexture = currentTexture
      }

      var currentFrame = i % anim.framesPerTexture

      var x = w * (currentFrame % anim.framesPerX)
      var y = h * Math.floor(currentFrame / anim.framesPerX)

      var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, w, h))
      frames.push(texture)
    }

    var movie = new PIXI.extras.AnimatedSprite(frames)
    movie.position.set(anim.x * data.scale, anim.y * data.scale)
    movie.animationSpeed = 0.5 * (anim.speed ? anim.speed : 1)
    if (anim.isBackground) movie.play()
    else movie.loop = false
    tileContainer.addChild(movie)
    anim.movie = movie
  }


  for (var i = 0; i < data.markers.length; i++) {
    var marker = data.markers[i]

    var markerSprite = new PIXI.Sprite(PIXI.loader.resources.marker.texture)
    markerSprite.anchor.set(0.5, 1.0)
    markerSprite.position.set(marker.x * data.scale, marker.y * data.scale)
    markerSprite.scale.set(0.5, 0.5)
    tileContainer.addChild(markerSprite)
  }
}

function render(deltaTime) {
  for (var i = 0; i < animatedYoko.length; i++) {
    var yoko = animatedYoko[i]

    if (yoko.animationTime >= data.yokoAnimationPeriod) {
      yokoCollected++
      counterNumber.innerHTML = '' + yokoCollected

      tileContainer.removeChild(yoko.sprite)
      yoko.sprite = null
      animatedYoko.splice(i, 1)
      i--
      continue
    }

    var t = yoko.animationTime / data.yokoAnimationPeriod
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

  var mapWidth = data.map.width * data.scale
  var mapHeight = data.map.height * data.scale

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

  for (var i = 0; i < data.yoko.length; i++) {
    var yoko = data.yoko[i]

    if (yoko.isAnimated) continue

    var dX = x - yoko.x
    var dY = y - yoko.y

    if (dX * dX + dY * dY <= data.yokoRadius * data.yokoRadius) {
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

  for (var name in data.animations) {
    var anim = data.animations[name]

    if (anim.isBackground) continue

    if (anim.x * data.scale <= mapX && anim.y * data.scale <= mapY &&
      (anim.x + anim.width) * data.scale >= mapX && (anim.y + anim.height) * data.scale >= mapY) {
      anim.movie.gotoAndPlay(0)
      break
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
