var c
var ctx

const draw = async (canvas, template, asset) => {
    c = document.getElementById(canvas)
    console.log(c)
    ctx = c.getContext('2d');
    const bg = new Image()
    bg.crossOrigin = '';
    bg.src = template
    bg.onload = function() {
        console.log(bg)
        ctx.drawImage(bg, 0, 0, 1200, 630)
        const img = new Image()
        img.crossOrigin = '';
        img.src = asset.mchh.cache_image;
        img.onload = function() {
            ctx.drawImage(img, 120, 150, 400, 400);
            ctx.font = "40px Arial";
            ctx.fillStyle = "rgba(255, 255, 255)";
            ctx.fillText(asset.mchh.attributes.hero_name, 620, 200);
            ctx.fillText("Lv. " + asset.mchh.attributes.lv, 620, 250);
            ctx.fillText("1 ETH", 620, 520);
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