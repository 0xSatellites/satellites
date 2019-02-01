const Canvas = require('canvas')
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Regular.otf', { family: 'Noto Sans JP' })
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Bold.otf', { family: 'Noto Sans JP Bold', weight: 'bold'})

const draw = (order, status, message) => {
    console.log("ok")

}

module.exports = draw