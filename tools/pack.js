const Jimp = require('jimp')

const settings = {
    basePath: './ftp2/YOKO_Park/',
    outPath: './textures/',
    scale: 0.5,
    animTextureSize: 2048,
    map: {
        path: 'Park/YokoPark_Background.png',
        outName: 'map',
        textureSize: 1024,
        quality: 80
    },
    animations: [
        {
            path: 'Живые деокрации - Ambient_animations/Водопад/_YokoSite_Waterfall_Sprite.png',
            outName: 'waterfall',
            width: 950,
            height: 950,
            x: 4000,
            y: 750,
            numFrames: 100
        },
        {
            path: 'Живые деокрации - Ambient_animations/Блики на воде1/_YokoSite_Water_Sprite.png',
            outName: 'water1',
            width: 1340,
            height: 580,
            x: 3200,
            y: 1480,
            numFrames: 31
        },
        {
            path: 'Живые деокрации - Ambient_animations/Блики на воде2/_YokoSite_Water_2_Sprite.png',
            outName: 'water2',
            width: 1600,
            height: 600,
            x: 1100,
            y: 2260,
            numFrames: 31
        },
        {
            path: 'Живые деокрации - Ambient_animations/Домик тети Маши/_YokoSite_Light_Sprite.png',
            outName: 'lights',
            width: 420,
            height: 300,
            x: 3840,
            y: 2220,
            numFrames: 15,
            textureSize: 1024
        },
        {
            path: 'Волшебные превращения - FXs/Песочница - Замок/_YokoSite_Castle_Sprite.png',
            outName: 'castle',
            width: 1060,
            height: 910,
            x: 1560,
            y: 1270,
            numFrames: 30
        },
        {
            path: 'Волшебные превращения - FXs/Коряга - Пиратский корабль/_YokoSite_Ship_Sprite.png',
            outName: 'ship',
            width: 1120,
            height: 830,
            x: 1020,
            y: 1980,
            numFrames: 87
        },
        {
            path: 'Волшебные превращения - FXs/Вороны - Пингвины/_YokoSite_Crows_Sprite.png',
            outName: 'penguins',
            width: 580,
            height: 600,
            x: 2840,
            y: 1940,
            numFrames: 45,
            textureSize: 1024
        },
        {
            path: 'Волшебные превращения - FXs/Статуя Йоко - Йоко/_YokoSite_Statue_Sprite.png',
            outName: 'statue',
            width: 1040,
            height: 960,
            x: 2420,
            y: 1400,
            numFrames: 30
        },
        {
            path: 'Волшебные превращения - FXs/Елка - Ракета/_YokoSite_Rocket_Sprite.png',
            outName: 'rocket',
            width: 490,
            height: 610,
            x: 2860,
            y: 950,
            numFrames: 34
        }
    ]
}

Jimp.read(settings.basePath + settings.map.path).then(function(mapImage) {
    const mapScaled = mapImage.clone().scale(settings.scale)

    console.log('Map loaded.')

    const texSize = settings.map.textureSize

    const mapWidth = mapScaled.bitmap.width
    const mapHeight = mapScaled.bitmap.height

    const texNumX = Math.ceil(mapWidth / texSize)
    const texNumY = Math.ceil(mapHeight / texSize)

    for (let i = 0; i < texNumY; i++) {
        for (let j = 0; j < texNumX; j++) {
            new Jimp(texSize, texSize, function(err, outImage) {
                const x = j * texSize
                const y = i * texSize
                const w = x + texSize > mapWidth ? mapWidth - x : texSize
                const h = y + texSize > mapHeight ? mapHeight - y : texSize

                const outPath = settings.outPath + settings.map.outName + (i * texNumX + j) + '.png'
                //outImage.blit(mapScaled, 0, 0, x, y, w, h).quality(settings.map.quality).write(outPath)
                outImage.blit(mapScaled, 0, 0, x, y, w, h).deflateLevel(9).write(outPath, function() {

                })

                console.log(`Saved map tile ${x} ${y} to ${outPath}`)
            })
        }
    }

    for (let anim of settings.animations) {
        Jimp.read(settings.basePath + anim.path).then(function(animImage) {
            //animImage = animImage.scale(settings.scale)

            console.log(`Animation '${anim.outName}' loaded.`)

            const texSize = anim.textureSize || settings.animTextureSize
            const animWidth = animImage.bitmap.width
            const animHeight = animImage.bitmap.height
            const frameWidth = anim.width * settings.scale
            const frameHeight = anim.height * settings.scale
            const framesPerX = Math.floor(texSize / frameWidth)
            const framesPerY = Math.floor(texSize / frameHeight)
            const framesPerTexture = framesPerX * framesPerY
            //const numFrames = animWidth / frameWidth
            const numFrames = anim.numFrames

            new Jimp(anim.width, anim.height, function(err, tempImage) {
                //tempImage.blit(mapImage, 0, 0, anim.x, anim.y, anim.width, anim.height)

                let currentFrame = 0
                let currentTexture = 0

                function doAnimation() {
                    new Jimp(texSize, texSize, function(err, outImage) {

                        function finalizeAnimation() {
                            const outPath = settings.outPath + anim.outName + currentTexture + '.png'
                            outImage.deflateLevel(9).write(outPath, function() {

                            })

                            console.log(`Saved animation '${anim.outName}' texture ${currentTexture} to ${outPath}`)

                            currentTexture++
                        }

                        while (true) {
                            if (currentFrame >= numFrames) {
                                finalizeAnimation()
                                return
                            }

                            const currentTextureFrame = currentFrame - framesPerTexture * currentTexture
                            const x = currentTextureFrame % framesPerX
                            const y = Math.floor(currentTextureFrame / framesPerX)

                            if (y >= framesPerY) {
                                finalizeAnimation()
                                doAnimation()
                                return
                            }

                            new Jimp(anim.width, anim.height, function(err, frameImage) {
                                frameImage.blit(animImage, 0, 0, currentFrame * anim.width, 0, anim.width, anim.height)

                                const compImage = tempImage.clone()
                                //compImage.composite(frameImage, 0, 0)
                                compImage.blit(frameImage, 0, 0)
                                compImage.scale(settings.scale)

                                outImage.blit(compImage, x * frameWidth, y * frameHeight)
                            })

                            currentFrame++
                        }
                    })
                }

                doAnimation()
            })
        })
    }
})
