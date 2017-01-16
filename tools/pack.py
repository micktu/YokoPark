# -*- coding: utf8 -*-
from __future__ import unicode_literals 

import math
from PIL import Image

settings = {
    'basePath': './ftp2/YOKO_Park/',
    'outPath': './textures/',
    'scale': 0.25,
    'animTextureSize': 2048,
    'map': {
        'path': 'Park/YokoPark_Background.png',
        'outName': 'map',
        'textureSize': 1024,
        'quality': 80
    },
    'animations': [
        {
            'path': 'Живые деокрации - Ambient_animations/Водопад/_YokoSite_Waterfall_Sprite.png',
            'outName': 'waterfall',
            'width': 950,
            'height': 950,
            'x': 4000,
            'y': 750,
            'numFrames': 100
        },
        {
            'path': 'Живые деокрации - Ambient_animations/Блики на воде1/_YokoSite_Water_Sprite.png',
            'outName': 'water1',
            'width': 1340,
            'height': 580,
            'x': 3200,
            'y': 1480,
            'numFrames': 31
        },
        {
            'path': 'Живые деокрации - Ambient_animations/Блики на воде2/_YokoSite_Water_2_Sprite.png',
            'outName': 'water2',
            'width': 1600,
            'height': 600,
            'x': 1100,
            'y': 2260,
            'numFrames': 31
        },
        {
            'path': 'Живые деокрации - Ambient_animations/Домик тети Маши/_YokoSite_Light_Sprite.png',
            'outName': 'lights',
            'width': 420,
            'height': 300,
            'x': 3840,
            'y': 2220,
            'numFrames': 15,
            'textureSize': 1024
        },
        {
            'path': 'Волшебные превращения - FXs/Песочница - Замок/_YokoSite_Castle_Sprite.png',
            'outName': 'castle',
            'width': 1060,
            'height': 910,
            'x': 1560,
            'y': 1270,
            'numFrames': 30
        },
        {
            'path': 'Волшебные превращения - FXs/Коряга - Пиратский корабль/_YokoSite_Ship_Sprite.png',
            'outName': 'ship',
            'width': 1120,
            'height': 830,
            'x': 1020,
            'y': 1980,
            'numFrames': 87
        },
        {
            'path': 'Волшебные превращения - FXs/Вороны - Пингвины/_YokoSite_Crows_Sprite.png',
            'outName': 'penguins',
            'width': 580,
            'height': 600,
            'x': 2840,
            'y': 1940,
            'numFrames': 45,
            'textureSize': 1024
        },
        {
            'path': 'Волшебные превращения - FXs/Статуя Йоко - Йоко/_YokoSite_Statue_Sprite.png',
            'outName': 'statue',
            'width': 1040,
            'height': 960,
            'x': 2420,
            'y': 1400,
            'numFrames': 30
        },
        {
            'path': 'Волшебные превращения - FXs/Елка - Ракета/_YokoSite_Rocket_Sprite.png',
            'outName': 'rocket',
            'width': 490,
            'height': 610,
            'x': 2860,
            'y': 950,
            'numFrames': 34
        }
    ]
}


basePath = settings['basePath']
mapSettings = settings['map']

mapImage = Image.open(basePath + mapSettings['path'])
mapSize = mapImage.size;

texSize = mapSettings['textureSize']
scale = settings['scale']
mapWidth = int(round(scale * mapSize[0]))
mapHeight = int(round(scale * mapSize[1]))

mapScaled = mapImage.resize((mapWidth, mapHeight), Image.BOX) 
texNumX = int(math.ceil(float(mapWidth) / texSize))
texNumY = int(math.ceil(float(mapHeight) / texSize))

for i in range(texNumY):
    for j in range(texNumX):
        x = j * texSize
        y = i * texSize
        w = x + (mapWidth - x ) if x + texSize > mapWidth else texSize 
        h = y + (mapHeight - y ) if y + texSize > mapHeight else texSize
        
        texImage = Image.new('RGB', (texSize, texSize))
        texImage.paste(mapScaled.crop((x, y, x + w, y + h)))

        outPath = settings['outPath'] + mapSettings['outName'] + str(i * texNumX + j) + '.jpg'
        texImage.save(outPath)

def finalizeAnimation(outImage, anim, currentTexture):
    outPath = settings['outPath'] + anim['outName'] + str(currentTexture) + '.png'
    outImage.save(outPath)
    print "Saved animation '%s' texture %d to %s" % (anim['outName'], currentTexture, outPath)


for anim in settings['animations']:
    animImage = Image.open(basePath + anim['path'])
    print 'Animation %s loaded.' % anim['outName']

    texSize = settings['animTextureSize']
    if 'textureSize' in anim:
        texSize = anim['textureSize']

    animWidth = animImage.size[0]
    animHeight = animImage.size[1]
    frameWidth = int(round(anim['width'] * scale))
    frameHeight = int(round(anim['height'] * scale))
    framesPerX = texSize / frameWidth
    framesPerY = texSize / frameHeight
    framesPerTexture = framesPerX * framesPerY
    numFrames = anim['numFrames']

    currentFrame = 0
    currentTexture = 0

    outImage = Image.new('RGBA', (texSize, texSize))

    while True:
        currentTextureFrame = currentFrame - framesPerTexture * currentTexture
        x = currentTextureFrame % framesPerX
        y = currentTextureFrame / framesPerX

        if y >= framesPerY:
            finalizeAnimation(outImage, anim, currentTexture)
            outImage = Image.new('RGBA', (texSize, texSize))
            currentTexture += 1
            continue

        frameImage = animImage.crop((currentFrame * anim['width'], 0, currentFrame * anim['width'] + anim['width'], anim['height'])).resize((frameWidth, frameHeight), Image.BOX)
        outImage.paste(frameImage, (x * frameWidth, y * frameHeight))

        currentFrame += 1

        if currentFrame >= numFrames:
            finalizeAnimation(outImage, anim, currentTexture)
            break
