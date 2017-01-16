document.addEventListener('DOMContentLoaded', function () {
    window.data = require('./data')

    const YokoPark = require('./YokoPark')
    window.YokoPark = YokoPark
    YokoPark.init()
})
