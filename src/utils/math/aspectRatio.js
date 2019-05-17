/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
export default function(srcWidth, srcHeight, maxWidth, maxHeight, cover = false) {

  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
  const aR = { width: srcWidth * ratio, height: srcHeight * ratio }

    if (cover) {
      const vW = Math.floor(window.innerWidth)
      const vH = Math.floor(window.innerHeight)

      if (vW > Math.floor(aR.width)) {
        aR.height *= vW / Math.floor(aR.width)
        aR.width *= vW / Math.floor(aR.width)
      } else if (vH > Math.floor(aR.height)) {
        aR.width *= vH / Math.floor(aR.height)
        aR.height *= vH / Math.floor(aR.height)
      }
    }

    return aR
}