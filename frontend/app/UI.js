let container
let locationWindow, episodeWindow, gameWindow, hintWindow
let currentWindow, helpOpenedByMouseover = false
let counter

function init(с) {
  container = с
  locationWindow = container.querySelector('.window.location')
  episodeWindow = container.querySelector('.window.episode')
  gameWindow = container.querySelector('.window.game')
  hintWindow = container.querySelector('.window.hint')

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
    openWindow(episodeWindow)
  })

  var gameButton = locationWindow.querySelector('.button.right')
  gameButton.addEventListener('click', function () {
    openWindow(gameWindow)
  })

  container.querySelector('.counter').addEventListener('click', function () {
    helpOpenedByMouseover = false

    if (currentWindow !== hintWindow)
      openWindow(hintWindow)
    else
      closeWindow(hintWindow)
  })

  /*
  const help = container.querySelector('.counter .help')

  help.addEventListener('mouseover', function() {
    if (currentWindow !== hintWindow) {
      openWindow(hintWindow)
      helpOpenedByMouseover = true
    }
  })

  help.addEventListener('mouseout', function() {
    if (helpOpenedByMouseover && currentWindow === hintWindow) {
      closeWindow(hintWindow)
    }
  })
  */

  counter = container.querySelector('.counter span')

  container.style.display = 'block'
}

function render(deltaTime) {

}

function openWindow(window) {
  if (currentWindow) {
    closeWindow(currentWindow)
    setTimeout(function () {
      openWindow(window)
    }, 300)
    return
  }

  window.style.visibility = 'visible'
  window.style.opacity = 1.0
  currentWindow = window
}

function closeWindow(window) {
  window.style.opacity = 0
  setTimeout(function () {
    window.style.visibility = 'hidden'
    currentWindow = null
  }, 300)
}

function handleClick(mapX, mapY) {
  if (currentWindow) {
    var windows = container.querySelectorAll('.window')

    for (var i = 0; i < windows.length; i++) {
      closeWindow(windows[i])
    }

    //return true
    return false
  }

  return false
}

function openLocationWindow() {
  openWindow(locationWindow)
}

function updateYokoCounter(amount, totalAmount) {
  //counter.innerHTML = "" + amount
  counter.innerHTML = `${amount}/${totalAmount}`
  hintWindow.querySelector('h3').innerHTML = `Найдено ${amount} из ${totalAmount} Йоко`
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
