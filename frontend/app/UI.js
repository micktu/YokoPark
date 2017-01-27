let container
let locationWindow, episodeWindow, gameWindow
let isWindowOpen = false
let counter

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
  updateYokoCounter(0)

  container.style.display = 'block'  
}

function render(deltaTime) {

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

  return false
}

function openLocationWindow() {
  openWindow(locationWindow)
}

function updateYokoCounter(amount) {
    counter.innerHTML = "" + amount
}

module.exports = {
  init,
  onAssetsLoaded,
  render,
  openWindow,
  closeWindow,
  handleClick,
  openLocationWindow,
  updateYokoCounter
}
