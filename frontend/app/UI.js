module.exports = class {
  constructor(container) {
    this.container = container
    this.windows = {}

    const windows = container.querySelectorAll('.window')

    for (var i = 0; i < windows.length; i++) {
      var w = windows[i]
      w.style.visibility = 'hidden'
      w.style.opacity = 0

      const stop = function (event) {
        event.stopPropagation()
      }

      w.addEventListener('mousedown', stop)
      w.addEventListener('mouseup', stop)
      w.addEventListener('touchstart', stop)
      w.addEventListener('touchend', stop)

      this.windows[w.classList.item(1)] = w;
    }
  }

  onAssetsLoaded(stage) {
    const closeButtons = this.container.querySelectorAll('.button.close')
    const ui = this;

    for (var i = 0; i < closeButtons.length; i++) {
      var button = closeButtons[i]

      var f = function (button) {
        return function () { ui.closeWindow(button.parentElement) }
      }

      button.addEventListener('click', f(button))
    }

    var episodeButton = this.windows.location.querySelector('.button.left')
    episodeButton.addEventListener('click', function () {
      ui.openWindow(ui.windows.episode)
    })

    var gameButton = this.windows.location.querySelector('.button.right')
    gameButton.addEventListener('click', function () {
      ui.openWindow(ui.windows.game)
    })

    this.container.querySelector('.counter').addEventListener('click', function () {
      ui.helpOpenedByMouseover = false

      if (ui.currentWindow !== ui.windows.hint)
        ui.openWindow(ui.windows.hint)
      else
        ui.closeWindow(ui.windows.hint)
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

    const buttons = this.container.querySelectorAll('.window.social .buttons .share a')

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function (event) {
        window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=800')
        event.preventDefault()
      })
    }

    this.container.querySelector('.window.social .buttons .replay').addEventListener('click', function (event) {
      YokoPark.Map.yokoManager.resetYokos()
      ui.closeWindow(ui.windows.social)

      event.preventDefault()
    })

    this.counter = this.container.querySelector('.counter span')

    this.container.style.display = 'block'
  }

  openWindow(window) {
    if (this.currentWindow) {
      this.closeWindow(this.currentWindow)
      const ui = this;
      setTimeout(function () {
        ui.openWindow(window)
      }, 300)
      return
    }

    window.style.visibility = 'visible'
    window.style.opacity = 1.0
    this.currentWindow = window
  }

  closeWindow(window) {
    window.style.opacity = 0
    const ui = this;
    setTimeout(function () {
      window.style.visibility = 'hidden'
      ui.currentWindow = null
    }, 300)
  }

  openLocationWindow() {
    this.openWindow(this.windows.location);
  }

  openGameWindow() {
    this.openWindow(this.windows.game);
  }

  openSocialWindow() {
    this.openWindow(this.windows.social);
  }

  handleClick(mapX, mapY) {
    if (this.currentWindow) {
      this.closeWindow(this.currentWindow);

      //return true
    }

    return false
  }

  updateYokoCounter(amount, totalAmount) {
    this.counter.innerHTML = `${amount}/${totalAmount}`
    this.windows.hint.querySelector('h3').innerHTML = `Найдено ${amount} из ${totalAmount} Йоко`
  }
}
