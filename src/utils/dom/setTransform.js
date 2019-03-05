export default function (element, string) {
  element.style.webkitTransform = string
  element.style.MozTransform = string
  element.style.msTransform = string
  element.style.OTransform = string
  element.style.transform = string
}
