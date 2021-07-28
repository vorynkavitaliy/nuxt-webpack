const svgSprite = require('@/assets/svg/icon-sprite.svg')
export default (context) => {
  if (process.server) {
    context.res.__SVG_SPRITE__ = svgSprite
  }
}
