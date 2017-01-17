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

  onAssetsLoaded() {
    var data = this.data
    var renderer = YokoPark.renderer

    if (!data.isBackground) {
      //mapGraphics.drawRect(anim.x * TextureData.scale, anim.y * TextureData.scale, anim.width * TextureData.scale, anim.height * TextureData.scale)
    }

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
    sprite.position.set(data.x * TextureData.scale, data.y * TextureData.scale)
    sprite.animationSpeed = 0.5 * (data.speed ? data.speed : 1)
    if (data.type === "background") sprite.play()
    else sprite.loop = false
    YokoPark.Map.tileContainer.addChild(sprite)
    this.sprite = sprite
  }

  hit(x, y) {
    const data = this.data
    if (data.isBackground) return false

    const left = data.x * TextureData.scale
    const top = data.y * TextureData.scale
    const right = left + data.width * TextureData.scale
    const bottom = top + data.height * TextureData.scale

    return left <= x && right >= x && top <= y && bottom >= y
  }

  play() {
      this.sprite.gotoAndPlay(0)
  }
}
