const Anim = require('./Anim')

module.exports = class {
  constructor(container) {
    this.container = container

    this.anims = {}
    this.animList = []

    for (let name in TextureData.animations) {
      this.anims[name] = new Anim(name)
    }

    const am = this
    window.addEventListener('keydown', function (event) {
      if (event.keyCode === 192) {
        am.overlay.visible = !am.overlay.visible
      }
    }, false)
  }

  onAssetsLoaded(stage) {
    const container = this.container

    const backContainer = new PIXI.Container()
    container.addChild(backContainer)
    this.backContainer = backContainer

    const overlay = new PIXI.Graphics()
    overlay.lineStyle(2, 0x00FF00)
    container.addChild(overlay)
    overlay.visible = false
    this.overlay = overlay

    const frontContainer = new PIXI.Container()
    container.addChild(frontContainer)

    const hintContainer = new PIXI.Container()
    container.addChild(hintContainer)

    for (let name in this.anims) {
      const anim = this.anims[name]
      let c

      switch (anim.data.type) {
        case 'background':
          c = backContainer
          break
        case 'interactive':
          c = frontContainer
          this.animList.push(anim)        
          break
        case 'hint':
          c = hintContainer
          break
        case 'misc':
          c = stage
          break
      }

      anim.init(c)

      if (anim.isInteractive) {
        overlay.drawRect(anim.hitbox.left, anim.hitbox.top, anim.hitbox.right - anim.hitbox.left, anim.hitbox.bottom - anim.hitbox.top)
      }
    }

    this.currentActivationIndex = 0
    //this.setNextActivation()

    this.currentHintIndex = 0
    this.armNextHint()
  }

  render(deltaTime) {
    const anims = this.anims

    for (let name in anims) {
      const anim = anims[name]
      const isPlayable = anim.isInteractive && !anim.isReverse && !anim.sprite.playing && !anim.hint.sprite.playing
      if (isPlayable && anim.hit(YokoPark.Map.hoverX, YokoPark.Map.hoverY)) {
        anim.hint.sprite.gotoAndPlay(0)
      }
    }
  }

  click(x, y) {
    for (let name in this.anims) {
      var anim = this.anims[name]

      if (anim.hit(x, y)) {
        anim.play()
        return
      }
    }
  }

  setNextActivation() {
    const period = Math.random() * Data.activationPeriodMin + (Data.activationPeriodMax - Data.activationPeriodMin)
    const am = this
    setTimeout(function () { am.playNextAnim() }, period)
  }

  playNextAnim() {
    let nextAnim
    let counter = 0

    while (!nextAnim) {
      const index = this.currentActivationIndex
      this.currentActivationIndex++
      this.currentActivationIndex %= Data.activationCycle.length

      const anim = this.anims[Data.activationCycle[index]]
      if (!anim.sprite.playing && !anim.isReverse) nextAnim = anim

      counter++
      if (counter >= Data.activationCycle.length) break
    }

    nextAnim.play()
    this.setNextActivation()
  }

  armNextHint() {
    const period = Data.hintPeriodMin + Math.random() * (Data.hintPeriodMax - Data.hintPeriodMin)
    const am = this
    setTimeout(function () { am.playNextHint() }, period)
  }

  playNextHint() {
    for (let i = 0; i < this.animList.length; i++) {
      const index = (i + this.currentHintIndex) % this.animList.length

      const anim = this.animList[index]

      const isPlaying = anim.sprite.playing || anim.isReverse || anim.hint.sprite.playing
      if (!isPlaying) {
        const isVisible = YokoPark.Map.viewportContains(anim.sprite.x, anim.sprite.y)

        if (isVisible) {
          this.currentHintIndex = index + 1
          anim.hint.sprite.gotoAndPlay(0)
          break;
        }
      }
    }
    
    this.armNextHint()
  }
}
