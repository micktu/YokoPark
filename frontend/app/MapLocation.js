module.exports = class {
  constructor(data) {
    this.data = data
    this.animationTime = Math.random() * 1550
  }

  init(container) {
    var sprite = new PIXI.Sprite(PIXI.loader.resources.marker.texture)
    sprite.anchor.set(0.5, 1.0)
    sprite.position.set(this.data.x * TextureData.scale, this.data.y * TextureData.scale)
    sprite.scale.set(0.5, 0.5)
    container.addChild(sprite)
    this.sprite = sprite
    this.y = this.sprite.y
  }

  render(deltaTime) {
    var val = Math.cos(this.animationTime / 1000) * 2
    this.sprite.y = this.y + val * val * val * val
    this.animationTime += deltaTime
  }
}