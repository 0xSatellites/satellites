var c
var ctx

const draw = async (canvas, template, asset) => {
    c = document.getElementById(canvas)
    ctx = c.getContext('2d');
    const bg = new Image()
    bg.crossOrigin = '';
    bg.src = template
    bg.onload = function() {
        ctx.drawImage(bg, 0, 0, 1200, 630)
        const img = new Image()
        img.crossOrigin = '';
        img.src = asset.mchh.cache_image;
        img.onload = function() {
            ctx.drawImage(img, 200, 100, 300, 300);
            ctx.font = "30px Arial";
            ctx.fillStyle = "rgba(255, 255, 255)";
            ctx.fillText(asset.mchh.attributes.hero_name, 50, 50);
        }
    }
}

const generate = () => {
    return c.toDataURL("image/png")
}

const canvas = {
  draw:draw,
  generate:generate
}

export default canvas