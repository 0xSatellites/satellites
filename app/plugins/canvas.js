var c
var ctx

const initialize = (canvas) => {
  c = document.getElementById(canvas)
  ctx = c.getContext('2d')
}

const draw = (template, asset, price) => {
  const bg = new Image()
  bg.crossOrigin = 'anonymous'
  bg.src = template
  bg.onload = function() {
    ctx.drawImage(bg, 0, 0, 1200, 630)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = asset.cache_image
    img.onload = function() {
      ctx.drawImage(img, 120, 150, 400, 400)
      ctx.font = '40px Arial'
      ctx.fillStyle = 'rgba(255, 255, 255)'
      ctx.fillText(asset.attributes.hero_name, 620, 200)
      ctx.fillText('Lv. ' + asset.attributes.lv, 620, 250)
      ctx.fillText(price + ' ETH', 620, 300)
    }
  }
}

const generate = () => {
  return c.toDataURL('image/png')
}

const canvas = {
  initialize: initialize,
  draw: draw,
  generate: generate
}

export default canvas
