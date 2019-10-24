export default function ({ hue = Math.random() * 255, sat = Math.random() * 255, lum = Math.random() * 255 } = {}) {
  return { h: hue, s: sat, l: lum, string: `hsl( ${hue}, ${sat}%, ${lum}% )` }
}
