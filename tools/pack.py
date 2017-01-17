import math, json
from PIL import Image

settings = {
    'jsonInFile': './animations.json',
    'jsonOutFile': '../frontend/public/textures.json',
    'basePath': '../ftp/YOKO_Park/',
    'outPath': '../frontend/public/images/textures/',
    'scale': 0.25,
    'animTextureSize': 2048,
    'map': {
        'path': 'Park/YokoPark_Background.png',
        'outName': 'map',
        'textureSize': 1024,
        'quality': 80
    }
}

with open(settings['jsonInFile'], ) as jsonFile:
    animations = json.load(jsonFile)

basePath = settings['basePath']
mapSettings = settings['map']

mapImage = Image.open(basePath + mapSettings['path'])
mapSize = mapImage.size

outData= {
    'scale': settings['scale'],
    'map': {
        'name': mapSettings['outName'],
        'textureSize': mapSettings['textureSize'],
        'width': mapSize[0],
        'height': mapSize[1]
    }
}

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
        print "Saved map texture %d, %d" % (j, i)

def finalizeAnimation(outImage, anim, currentTexture):
    outPath = settings['outPath'] + anim['outName'] + str(currentTexture) + '.png'
    outImage.save(outPath)
    print "Saved animation '%s' texture %d" % (anim['outName'], currentTexture)

outData['animations'] = {}

for category, animList in animations.items():
    for anim in animList:
        animImage = Image.open(basePath + anim['path'])

        texSize = settings['animTextureSize']
        if 'textureSize' in anim:
            texSize = anim['textureSize']

        animWidth = animImage.size[0]
        animHeight = animImage.size[1]

        animDivWidth = anim['width'] - anim['width'] % 4
        animDivHeight = anim['height'] - anim['height'] % 4

        frameWidth = int(round(animDivWidth * scale))
        frameHeight = int(round(animDivHeight * scale))
        framesPerX = texSize / frameWidth
        framesPerY = texSize / frameHeight
        framesPerTexture = framesPerX * framesPerY

        numFrames = anim['numFrames'] if 'numFrames' in anim else animWidth / anim['width']

        animData = {
            'width': animDivWidth,
            'height': animDivHeight,
            'x': anim['x'],
            'y': anim['y'],
            'numFrames': numFrames,
            'textureSize': texSize,
            'type': category
        }

        if 'speed' in anim:
            animData['speed'] = anim['speed']

        outData['animations'][anim['outName']] = animData

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

            rect = (currentFrame * anim['width'], 0, currentFrame * anim['width'] + animDivWidth, animDivHeight)
            frameImage = animImage.crop(rect).resize((frameWidth, frameHeight), Image.BOX)
            outImage.paste(frameImage, (x * frameWidth, y * frameHeight))

            currentFrame += 1

            if currentFrame >= numFrames:
                finalizeAnimation(outImage, anim, currentTexture)
                break

    with open(settings['jsonOutFile'], 'w') as jsonFile:
        json.dump(outData, jsonFile)
