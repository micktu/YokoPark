module.exports = class {
  constructor(name) {
    this.name = name
    const data = TextureData.animations[name]
    this.data = data

    this.texSize = data.textureSize || Data.animTextureSize

    this.framesPerX = Math.floor(this.texSize / (data.width * TextureData.scale))
    this.framesPerY = Math.floor(this.texSize / (data.height * TextureData.scale))
    this.framesPerTexture = this.framesPerX * this.framesPerY
    this.numTextures = Math.ceil(data.numFrames / this.framesPerTexture)

    for (let i = 0; i < this.numTextures; i++) {
      PIXI.loader.add(name + i, 'images/textures/' + name + i + '.png', YokoPark.textureOptions)
    }
  }

  init(container) {
    var data = this.data
    var renderer = YokoPark.renderer

    if (!data.speed) data.speed = 1
    this.speed = 0.5 * data.speed

    var w = data.width * TextureData.scale
    var h = data.height * TextureData.scale

    var prevTexture = -1
    var baseTexture

    var frames = []
    for (var i = 0; i < data.numFrames; i++) {
      var currentTexture = Math.floor(i / this.framesPerTexture)

      if (currentTexture !== prevTexture) {
        baseTexture = PIXI.loader.resources[this.name + currentTexture].texture.baseTexture
        renderer.textureManager.updateTexture(baseTexture)
        prevTexture = currentTexture
      }

      var currentFrame = i % this.framesPerTexture

      var x = w * (currentFrame % this.framesPerX)
      var y = h * Math.floor(currentFrame / this.framesPerX)

      var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, w, h))
      frames.push(texture)
    }

    var sprite = new PIXI.extras.AnimatedSprite(frames)
    sprite.position.set(Math.round(data.x * TextureData.scale), Math.round(data.y * TextureData.scale))
    sprite.animationSpeed = this.speed
    if (data.type === 'background') sprite.play()
    else sprite.loop = false
    container.addChild(sprite)
    this.sprite = sprite

    if (data.type === 'interactive') {
      this.hint = YokoPark.Map.spriteAnims[this.name + '-hint']
      this.armHitPlayback()
    }

    this.hitbox = {
      left: this.data.x,
      top: this.data.y,
      bottom: this.data.y + this.data.height,
      right: this.data.x + this.data.width
    }

    const hitOffset = Data.hitboxes[this.name]
    if (hitOffset) {
      this.hitbox.left += hitOffset.left
      this.hitbox.top += hitOffset.top
      this.hitbox.right -= hitOffset.right
      this.hitbox.bottom -= hitOffset.bottom
    }

    this.hitbox.left *= TextureData.scale
    this.hitbox.top *= TextureData.scale
    this.hitbox.right *= TextureData.scale
    this.hitbox.bottom *= TextureData.scale
  }

  hit(x, y) {
    const data = this.data
    if (data.type !== 'interactive') return false

    const b = this.hitbox
    return b.left <= x && b.right >= x && b.top <= y && b.bottom >= y
  }

  play() {
    if (this.sprite.playing) return

    this.sprite.animationSpeed = this.isReverse ? -this.speed : this.speed
    this.sprite.play()

    //if (this.isReverse) hint.fadeIn()
    //else hint.fadeOut()

    if (this.isReverse) {
      clearTimeout(this.reverseTimeout)
    } else {
      const anim = this
      this.reverseTimeout = setTimeout(function () {
        anim.play()
      }, Data.animationReversePeriod)
    }

    this.isReverse = !this.isReverse
  }

  fadeOut() {
    this.animationTime = 0
    this.isFadeIn = false
    this.isAnimated = true
  }

  fadeIn() {
    this.animationTime = 0
    this.isFadeIn = true
    this.isAnimated = true
  }

  animate(deltaTime) {
    const t = this.animationTime / 1000
    this.sprite.alpha = this.isFadeIn ? t : 1 - t
    this.animationTime += deltaTime
    if (this.animationTime > 1000) this.isAnimated = false
  }

  armHitPlayback() {
    var anim = this
    setTimeout(function () {
      if (!anim.isReverse && !anim.sprite.playing) {
        anim.hint.sprite.gotoAndPlay(0)
      }
      anim.armHitPlayback()
    }, 5000 + 5000 * Math.random())
  }
}
