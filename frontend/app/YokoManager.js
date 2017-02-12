module.exports = class {
  constructor(container) {
    this.container = container
    this.yokos = []
    this.animatedYokos = []
    this.collected = 0

    this.nextYokoTime = 0
    this.lastYokoIndex = 0

    PIXI.loader.add('yoko-right', 'images/yoko-right-256.png')
    PIXI.loader.add('yoko-up', 'images/yoko-up-256.png')
    //PIXI.loader.add('yoko-jump', 'images/yoko-jump.png')
  }

  onAssetsLoaded(stage) {
    this.totalAmount = Data.yoko.length

    const textureUp = PIXI.loader.resources['yoko-up'].texture
    const textureRight = PIXI.loader.resources['yoko-right'].texture

    const anchorUp = 0.56
    const anchorRight = 0.6

    let mask = new PIXI.Graphics()
    mask.beginFill(0xFFFFFFFF)
    mask.drawRect(0, -textureUp.width / 2, textureUp.width, textureUp.height)
    mask.visible = false
    this.container.addChild(mask)
    this.maskUp = mask

    mask = new PIXI.Graphics()
    mask.beginFill(0xFFFFFFFF)
    mask.drawRect(0, -textureUp.width / 2, textureRight.width, textureRight.height)
    mask.visible = false
    this.container.addChild(mask)
    this.maskRight = mask

    for (let yoko of Data.yoko) {
      yoko.mapX = yoko.x * TextureData.scale
      yoko.mapY = yoko.y * TextureData.scale

      const texture = yoko.type === 'up' ? textureUp : textureRight
      texture.baseTexture.mipmap = true
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.BILINEAR

      var sprite = new PIXI.Sprite(texture)
      sprite.anchor.set(0.42, yoko.type === 'up' ? anchorUp : anchorRight)
      sprite.position.set(yoko.mapX, yoko.mapY)

      const angle = yoko.rotation * Math.PI / 180
      const flip = yoko.flip ? -1 : 1
      sprite.rotation = angle
      yoko.normal = this.rotate(0, flip, angle + Math.PI / 2)

      if (!yoko.scale) yoko.scale = 1
      yoko.scale *= TextureData.scale
      sprite.scale.set(yoko.scale * flip, yoko.scale)

      yoko.scaleX = sprite.scale.x
      yoko.scaleY = sprite.scale.y

      yoko.height = sprite.height

      sprite.visible = false
      //sprite.alpha = 0

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

    YokoPark.UI.updateYokoCounter(this.collected, this.totalAmount)
  }

  render(deltaTime, time) {
    if (time >= this.nextYokoTime) {
      const length = this.yokos.length
      const index = (this.lastYokoIndex + Math.floor(Math.random() * (length - 1)) + 1) % length
      const yoko = this.yokos[index]
      this.lastYokoIndex = index

      this.setupMask(yoko)
      yoko.sprite.visible = true

      this.animate(yoko, "show", Data.yokoAnimationPeriod)

      const manager = this
      yoko.hideTimeout = setTimeout(function () {
        manager.setupMask(yoko)
        manager.animate(yoko, "hide", Data.yokoAnimationPeriod)
      }, Data.yokoAnimationPeriod + Data.yokoStayPeriod)

      this.nextYokoTime = time + Data.yokoAnimationPeriod + Data.yokoStayPeriod + Data.yokoAppearPeriodMin + Math.round(Math.random() * Data.yokoAppearPeriodMax)
    }

    for (let i = 0; i < this.animatedYokos.length; i++) {
      const yoko = this.animatedYokos[i]
      let h

      if (yoko.animationTime < yoko.animationDuration) {
        var t = yoko.animationTime / yoko.animationDuration
        yoko.animationTime += deltaTime

        switch (yoko.animationType) {
          case "collect":
            yoko.sprite.scale.x = yoko.scaleX * (1 + 0.5 * t)
            yoko.sprite.scale.y = yoko.scaleY * (1 + 0.5 * t)
            yoko.sprite.alpha = 1 - t
            continue
          case "show":
            //yoko.sprite.alpha = t
            t = 1 - t
            t = t * t * t * t * t
            h = t * 0.6 * yoko.height
            yoko.sprite.position.x = yoko.mapX + h * yoko.normal.x
            yoko.sprite.position.y = yoko.mapY + h * yoko.normal.y
            continue
          case "hide":
            //yoko.sprite.alpha = 1 - t
            t = t * t * t * t * t
            h = t * 0.6 * yoko.height
            yoko.sprite.position.x = yoko.mapX + h * yoko.normal.x
            yoko.sprite.position.y = yoko.mapY + h * yoko.normal.y
            continue
        }
      }

      switch (yoko.animationType) {
        case "collect":
          this.container.removeChild(yoko.sprite)
          yoko.sprite = null
          this.yokos.splice(this.yokos.indexOf(yoko), 1)
          break
        case "show":
          //yoko.sprite.alpha = 1
          yoko.sprite.position.x = yoko.mapX
          yoko.sprite.position.y = yoko.mapY
          yoko.sprite.mask.visible = false
          yoko.sprite.mask = null
          break
        case "hide":
          yoko.sprite.visible = false
          yoko.sprite.mask.visible = false
          yoko.sprite.mask = null
          //yoko.sprite.alpha = 0
          break
      }

      yoko.animationType = null
      this.animatedYokos.splice(i, 1)
      i--
    }
  }

  handleClick(x, y) {
    for (let yoko of this.yokos) {
      if (yoko.animationType || !yoko.sprite.visible) continue

      var dX = x - yoko.mapX
      var dY = y - yoko.mapY

      if (dX * dX + dY * dY <= Data.yokoRadius * Data.yokoRadius) {
        clearTimeout(yoko.hideTimeout)
        this.animate(yoko, "collect", Data.yokoAnimationPeriod)
        this.collect()
        return true
      }
    }

    return false
  }

  animate(yoko, type, duration) {
    yoko.animationType = type
    yoko.animationDuration = duration
    yoko.animationTime = 0
    this.animatedYokos.push(yoko)
  }

  setupMask(yoko) {
      const mask = yoko.type === 'up' ? this.maskUp : this.maskRight
      const sprite = yoko.sprite
      mask.position = sprite.position
      mask.rotation = sprite.rotation
      mask.scale = sprite.scale
      mask.visible = true
      sprite.mask = mask
  }

  collect() {
    this.collected++
    this.anim.sprite.gotoAndPlay(0)
    YokoPark.Sound.playJingle()

    const yoko = this
    setTimeout(function () {
      YokoPark.UI.updateYokoCounter(yoko.collected, yoko.totalAmount)
    }, Data.yokoAnimationPeriod)
  }

  rotate(x, y, angle) {
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)
    return new PIXI.Point(x * cosA - y * sinA, x * sinA + y * cosA)
  }
}
