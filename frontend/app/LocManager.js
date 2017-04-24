module.exports = class {
  constructor (container) {
    this.container = container
    this.locs = []

    PIXI.loader.add('marker', getImagePath('layout/marker.png'))
  }

  onAssetsLoaded () {
    for (let i = 0; i < Data.markers.length; i++) {
      const loc = Data.markers[i];
      loc.animationTime = 1000 * Math.random() * Math.PI / 2
      loc.mapX = loc.x * TextureData.scale
      loc.mapY = loc.y * TextureData.scale

      const sprite = new PIXI.Sprite(PIXI.loader.resources.marker.texture)
      sprite.anchor.set(0.5, 1.0)
      sprite.position.set(loc.mapX, loc.mapY)
      sprite.scale.set(0.5, 0.5)
      this.container.addChild(sprite)
      loc.sprite = sprite

      this.locs.push(loc)
    }
  }

  render (deltaTime) {
    for (let i = 0; i < this.locs.length; i++) {
      const loc = this.locs[i];
      const val = Math.cos(loc.animationTime / 1000) * 2
      loc.sprite.y = loc.mapY + val * val * val * val
      loc.animationTime += deltaTime
    }
  }

  handleClick (x, y) {
    for (let i = 0; i < this.locs.length; i++) {
      const loc = this.locs[i]
      var dX = x - loc.mapX
      var dY = y - loc.mapY

      if (dX * dX + dY * dY <= Data.markerRadius * Data.markerRadius) {
        YokoPark.UI.openLocationWindow()
        return true
      }
    }

    return false
  }
}
