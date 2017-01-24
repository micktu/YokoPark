let touchPressed = false, mousePressed = false

function init(container) {
  var body = document.body

  body.addEventListener('mousemove', onMouseMove)
  container.addEventListener('mousedown', onMouseDown)
  body.addEventListener('mouseup', onMouseUp)

  body.addEventListener('touchmove', onTouchMove)
  container.addEventListener('touchstart', onTouchStart)
  body.addEventListener('touchend', onTouchEnd)
}

function onTouchMove(event) {
  if (!touchPressed) return

  var touch = event.touches[0] || event.changedTouches[0]

  YokoPark.Map.mouseMove(touch.clientX, touch.clientY)

  event.preventDefault()
}

function onMouseMove(event) {
  YokoPark.Map.mouseMove(event.clientX, event.clientY)

  event.preventDefault()
}

function onTouchStart(event) {
  if (!event.touches || !event.touches[0]) return
  var touch = event.touches[0]

  YokoPark.Map.mouseDown(touch.clientX, touch.clientY)

  touchPressed = true
}

function onMouseDown(event) {
  if (!(event.buttons & 1)) return

  YokoPark.Map.mouseDown(event.clientX, event.clientY)

  mousePressed = true
}

function onTouchEnd(event) {
  var touch = event.touches[0] || event.changedTouches[0]

  YokoPark.Map.mouseUp(touch.clientX, touch.clientY)

  touchPressed = false
}

function onMouseUp(event) {
  YokoPark.Map.mouseUp(event.clientX, event.clientY)

  mousePressed = false
}

module.exports = { init }
