module.exports = class {
  constructor(container) {
    this.container = container
    this.yokos = []
    this.animatedYokos = []
    this.collected = 0

    PIXI.loader.add('yoko-right', 'images/yoko-right-256.png')
    PIXI.loader.add('yoko-up', 'images/yoko-up-256.png')
    //PIXI.loader.add('yoko-jump', 'images/yoko-jump.png')
  }

  onAssetsLoaded(stage) {
    for (let yoko of Data.yoko) {
      var name = yoko.type === 'up' ? 'yoko-up' : 'yoko-right'

      yoko.mapX = yoko.x * TextureData.scale
      yoko.mapY = yoko.y * TextureData.scale

      const texture = PIXI.loader.resources[name].texture
      texture.baseTexture.mipmap = true
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.BILINEAR
      
      var sprite = new PIXI.Sprite(texture)
      sprite.anchor.set(0.42, yoko.type === 'up' ? 0.56 : 0.6)
      sprite.position.set(yoko.mapX, yoko.mapY)
      sprite.rotation = yoko.rotation * Math.PI / 180

      if (!yoko.scale) yoko.scale = 1
      yoko.scale *= TextureData.scale
      sprite.scale.set(yoko.scale * (yoko.flip ? -1 : 1), yoko.scale)

      this.container.addChild(sprite)
      yoko.sprite = sprite
      this.yokos.push(yoko)
    }

    const anim = YokoPark.Map.animManager.anims.yoko
    anim.sprite.anchor.set(0.0, 1.0)
    //anim.sprite.x = 100
    anim.sprite.y = YokoPark.renderer.height
    anim.sprite.visible = true

    this.anim = anim
  }

  render(deltaTime) {
    for (let i = 0; i < this.animatedYokos.length; i++) {
      const yoko = this.animatedYokos[i]

      if (yoko.animationTime >= Data.yokoAnimationPeriod) {
        //this.collect()
        YokoPark.UI.updateYokoCounter(this.collected)
        

        this.container.removeChild(yoko.sprite)
        yoko.sprite = null
        this.animatedYokos.splice(i, 1)
        i--
        continue
      }

      var t = yoko.animationTime / Data.yokoAnimationPeriod
      yoko.sprite.scale.set(yoko.scaleX * (1 + 0.5 * t), yoko.scaleY * (1 + 0.5 * t))
      yoko.sprite.alpha = 1 - t

      yoko.animationTime += deltaTime
    }
  }

  handleClick(x, y) {
    for (let yoko of Data.yoko) {
      if (yoko.isAnimated) continue

      var dX = x - yoko.mapX
      var dY = y - yoko.mapY

      if (dX * dX + dY * dY <= Data.yokoRadius * Data.yokoRadius) {
        var scale = yoko.sprite.scale
        yoko.scaleX = scale.x
        yoko.scaleY = scale.y
        yoko.isAnimated = true
        yoko.animationTime = 0
        this.animatedYokos.push(yoko)
        this.collect()
        return true
      }
    }

    return false
  }

  collect() {
    this.collected++
    this.anim.sprite.gotoAndPlay(0)
    YokoPark.Sound.playJingle()
    //YokoPark.UI.updateYokoCounter(this.collected)    
  }
}
