const SpriteAnim = require('./SpriteAnim')
const MapLocation = require('./MapLocation')

let container, tileContainer, mapGraphics, backContainer, frontContainer, hintContainer
let currentActivationIndex = 0
const spriteAnims = {}, locations = []
const animatedYoko = []
let isDragging, dragX, dragY, dragMapX, dragMapY, oldX, oldY, velocityX, velocityY, hoverX, hoverY
const friction = 0.8

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

  window.addEventListener('keydown', function (event) {
    if (event.keyCode == 192) {
      mapGraphics.visible = !mapGraphics.visible
    }
  }, false)
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

  var backContainer = new PIXI.Container()
  tileContainer.addChild(backContainer)

  mapGraphics = new PIXI.Graphics()
  mapGraphics.lineStyle(2, 0x00FF00)
  tileContainer.addChild(mapGraphics)
  mapGraphics.visible = false

  frontContainer = new PIXI.Container()
  tileContainer.addChild(frontContainer)

  hintContainer = new PIXI.Container()
  tileContainer.addChild(hintContainer)

  for (let name in spriteAnims) {
    const anim = spriteAnims[name]
    let c

    switch (anim.data.type) {
      case 'background':
        c = backContainer
        break
      case 'interactive':
        c = frontContainer
        break
      case 'hint':
        c = hintContainer
        break
    }

    anim.init(c)

    if (anim.data.type === 'interactive') {
      mapGraphics.drawRect(anim.hitbox.left, anim.hitbox.top, anim.hitbox.right - anim.hitbox.left, anim.hitbox.bottom - anim.hitbox.top)
    }
  }
  setNextActivation()

  for (var i = 0; i < Data.markers.length; i++) {
    var location = new MapLocation(Data.markers[i])
    location.init(tileContainer)
    locations.push(location)
  }
}

function render(deltaTime) {
  var c = tileContainer

  if (isDragging) {
    velocityX = c.x - oldX
    velocityY = c.y - oldY

    oldX = c.x
    oldY = c.y
  }
  else if (velocityX * velocityX + velocityY * velocityY > 1) {
    c.x += velocityX
    c.y += velocityY

    velocityX *= friction
    velocityY *= friction

    clampMapBounds()
  }

  for (let name in spriteAnims) {
    const anim = spriteAnims[name]
    if (anim.data.type !== 'interactive') continue

    if (!anim.isReverse && !anim.sprite.playing && !anim.hint.sprite.playing && anim.hit(hoverX, hoverY)) {
      anim.hint.sprite.gotoAndPlay(0)
    }
    //if (anim.isAnimated) anim.animate(deltaTime)    
  }

  for (let loc of locations) {
    loc.render(deltaTime)
  }

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
  if (!tileContainer) return
  
  if (!isDragging) {
    var body = document.body
    hoverX = x + body.scrollLeft - container.offsetLeft - tileContainer.x
    hoverY = y + body.scrollTop - container.offsetTop - tileContainer.y
    return
  }

  var c = tileContainer
  var renderer = YokoPark.renderer

  c.x = dragMapX - dragX + x
  c.y = dragMapY - dragY + y

  clampMapBounds()
}

function handleClick(x, y) {
  var body = document.body

  var mapX = x + body.scrollLeft - container.offsetLeft - tileContainer.x
  var mapY = y + body.scrollTop - container.offsetTop - tileContainer.y

  if (YokoPark.UI.handleClick(mapX, mapY)) return

  for (var i = 0; i < Data.markers.length; i++) {
    var marker = Data.markers[i]

    var dX = mapX - marker.x * TextureData.scale
    var dY = mapY - marker.y * TextureData.scale

    if (dX * dX + dY * dY <= Data.markerRadius * Data.markerRadius) {
      YokoPark.UI.openLocationWindow()
      return true
    }
  }

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

function clampMapBounds() {
  var renderer = YokoPark.renderer
  var c = tileContainer

  var mapWidth = TextureData.map.width * TextureData.scale
  var mapHeight = TextureData.map.height * TextureData.scale

  if (c.x > 0) c.x = 0
  else if (c.x < renderer.width - mapWidth)
    c.x = renderer.width - mapWidth

  if (c.y > 0) c.y = 0
  else if (c.y < renderer.height - mapHeight)
    c.y = renderer.height - mapHeight
}

function setNextActivation() {
  const period = Math.random() * Data.activationPeriodMin + (Data.activationPeriodMax - Data.activationPeriodMin)
  setTimeout(playNextAnim, period)
}

function playNextAnim() {
  let nextAnim
  let counter = 0

  while (!nextAnim) {
    const index = currentActivationIndex
    currentActivationIndex++
    currentActivationIndex %= Data.activationCycle.length

    const anim = spriteAnims[Data.activationCycle[index]]
    if (!anim.sprite.playing && !anim.isReverse) nextAnim = anim

    counter++
    if (counter >= Data.activationCycle.length) break
  }

  nextAnim.play()
  setNextActivation()
}

module.exports = {
  init,
  onAssetsLoaded,
  render,
  mouseDown,
  mouseUp,
  mouseMove,
  get spriteAnims() { return spriteAnims }
}
