let container
let locationWindow, episodeWindow, gameWindow
let isCounterAnimated = false, counterAnimationTime = 0
let counter, counterYoko, collectedYokos = 0
let isWindowOpen = false

function init(с) {
  container = с
  locationWindow = container.querySelector('.window.location')
  episodeWindow = container.querySelector('.window.episode')
  gameWindow = container.querySelector('.window.game')

  var windows = container.querySelectorAll('.window')

  for (var i = 0; i < windows.length; i++) {
    var w = windows[i]
    w.style.visibility = 'hidden'
    w.style.opacity = 0

    var stop = function (event) {
      event.stopPropagation()
    }

    w.addEventListener('mousedown', stop)
    w.addEventListener('mouseup', stop)
    w.addEventListener('touchstart', stop)
    w.addEventListener('touchend', stop)
  }

  container.style.display = 'none'

  PIXI.loader.add('yoko-right', 'images/textures/yoko-right-256.png')
  PIXI.loader.add('yoko-up', 'images/textures/yoko-up-256.png')
  PIXI.loader.add('yoko-jump', 'images/layout/yoko-jump.png')
}

function onAssetsLoaded(stage) {
  var closeButtons = container.querySelectorAll('.button.close')

  for (var i = 0; i < closeButtons.length; i++) {
    var button = closeButtons[i]

    var f = function (button) {
      return function () { closeWindow(button.parentElement) }
    }

    button.addEventListener('click', f(button))
  }

  var episodeButton = locationWindow.querySelector('.button.left')
  episodeButton.addEventListener('click', function () {
    swapWindow(locationWindow, episodeWindow)
  })

  var gameButton = locationWindow.querySelector('.button.right')
  gameButton.addEventListener('click', function () {
    swapWindow(locationWindow, gameWindow)
  })

  counter = container.querySelector('.counter span')
  counter.innerHTML = "" + collectedYokos

  for (var i = 0; i < Data.yoko.length; i++) {
    var yoko = Data.yoko[i]
    var name = yoko.type === 'up' ? 'yoko-up' : 'yoko-right'

    var yokoSprite = new PIXI.Sprite(PIXI.loader.resources[name].texture)
    yokoSprite.anchor.set(0.42, yoko.type === 'up' ? 0.56 : 0.6)
    yokoSprite.position.set(yoko.x, yoko.y)
    yokoSprite.rotation = yoko.rotation * Math.PI / 180
    yokoSprite.scale.set(yoko.scale * (yoko.flip ? -1 : 1), yoko.scale)
    YokoPark.Map.tileContainer.addChild(yokoSprite)
    yoko.sprite = yokoSprite
  }

  counterYoko = new PIXI.Sprite(PIXI.loader.resources['yoko-jump'].texture)
  counterYoko.position.set(20, 700)
  stage.addChild(counterYoko)

  container.style.display = 'block'  
}

function render(deltaTime) {
  if (isCounterAnimated) {
    var t = counterAnimationTime / Data.counterAnimationPeriod

    if (t >= 1.0) {
      isCounterAnimated = false
      counterAnimationTime = 0
    } else {
      if (t < 0.3) {
        t = t / 0.3
        counterYoko.position.y = 700 + counterYoko.height * t * (t - 2)
      } else if (t < 0.7) {

      } else {
        t = (1 - t) / 0.3
        counterYoko.position.y = 700 - counterYoko.height * t * t * t
      }

      counterAnimationTime += deltaTime
    }
  }
}

function openWindow(window) {
  window.style.visibility = 'visible'
  window.style.opacity = 1.0
  isWindowOpen = true
}

function closeWindow(window) {
  window.style.opacity = 0
  setTimeout(function () {
    window.style.visibility = 'hidden'
    isWindowOpen = false
  }, 300)
}

function swapWindow(fromWindow, toWindow) {
  closeWindow(fromWindow)
  setTimeout(function () {
    openWindow(toWindow)
  }, 300)
}

function handleClick(mapX, mapY) {
  if (isWindowOpen) {
    var windows = container.querySelectorAll('.window')

    for (var i = 0; i < windows.length; i++) {
      closeWindow(windows[i])
    }

    return true
  }

  for (var i = 0; i < Data.markers.length; i++) {
    var marker = Data.markers[i]

    var dX = mapX - marker.x * Data.scale
    var dY = mapY - marker.y * Data.scale

    if (dX * dX + dY * dY <= Data.markerRadius * Data.markerRadius) {
      openWindow(locationWindow)
      return true
    }
  }

  return false
}

module.exports = {
  init,
  onAssetsLoaded,
  render,
  openWindow,
  closeWindow,
  handleClick,
}
