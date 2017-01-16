let container, bar, barWidth 

function init(c) {
  container = c
  bar = container.querySelector('.bar')

  barWidth = bar.offsetWidth
  bar.style.width = '0px'

  PIXI.loader.on('progress', function (loader) {
    updateProgress(loader.progress / 100)
  })
}

function updateProgress(progress) {
  bar.style.width = Math.round(progress * barWidth) + 'px'
}

function hide() {
  container.style.display = 'none'
}

module.exports = { init, updateProgress, hide }
