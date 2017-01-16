const fs = require('fs')
const { execSync } = require('child_process')

const texturePath = 'textures/'

fs.readdir(texturePath, function (err, filenames) {
    for (filename of filenames) {
        if (filename.indexOf('.png') < 0) continue

        let extension = 'pvr'
        let rgbFormat = 'PVRTC1_4_RGB'
        let RgbaFormat = 'PVRTC1_4'
        let fastQuality = 'pvrtcfastest'
        let bestQuality = 'pvrtcbest'
        let isBestQuality = true

        if (process.argv.length > 1) {
            const arg = process.argv[1]

            if (process.argv.length > 2) {
                isBestQuality = false
            }

            if (arg === 'atc') {
                extension = 'atc'
                rgbFormat = 'ETC1'
                RgbaFormat = 'ASTC_4x4'
                fastQuality = 'atcveryfast'
                bestQuality = 'atcexhaustive'
            } else if (arg === 'dds') {
                return
            }
        }

        const imageName = texturePath + filename
        const textureName = texturePath + filename.replace('.png', '.' + extension)

        const format = filename.indexOf('map') === 0 ? rgbFormat : RgbaFormat
        const quality = isBestQuality ? bestQuality : fastQuality

        execSync(`PVRTexToolCLI.exe -i "${imageName}" -o ${textureName} -f ${format} -q ${quality}`, function (error, stdout, stderr) {
            if (error) {
                console.error(`exec error: ${error}`);
            }
        })
    }
})
