module.exports = class {
  constructor() {
    this.lastJingleIndex = 0
    this.jingles = []

    for (let i = 0; i < 3; i++) {
      this.jingles[i] = new Howl({ src: [`sounds/Jingle_${ i + 1 }.mp3`] })
    }

    this.music = new Howl({ src: [`sounds/Music.mp3`], autoplay: true, loop: true, volume: 0.5 })
  }

  playJingle() {
    const length = this.jingles.length
    const index = (this.lastJingleIndex + Math.floor(Math.random() * (length - 1)) + 1) % length
    this.jingles[index].play()
    this.lastJingleIndex = index
  }

}
