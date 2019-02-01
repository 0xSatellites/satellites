const fs = require('fs')
const Canvas = require('canvas')
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Regular.otf', { family: 'Noto Sans JP' })
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Bold.otf', { family: 'Noto Sans JP Bold', weight: 'bold'})

const draw = (order, status, message) => {

    var canvas = Canvas.createCanvas(1200,630)
    var context = canvas.getContext('2d')
    var loadedImg=[]
    var bgImg = new Canvas.Image()
    bgImg.src = __dirname + '/assets/img/bg.png'
    console.log(__dirname + '/assets/img/bg.png')
    bgImg.onload = function() {
      console.log("ok")
      context.drawImage(bgImg, 0, 0)
    }

}

module.exports = draw