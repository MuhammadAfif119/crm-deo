
export function formatFrice (value) {
  if(!value) return 0
  let val = (value/1).toFixed(0).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function readMore (val) {
  if(!val) return ''
  val = val.replace(/\s{2,}/g, ' ')
  const strLength = val.length
  if(strLength > 18) {{
    val = val.slice(0,18) + '...'}

  }
  return val.toLowerCase()
    .replace(/\w/, firstLetter => firstLetter.toUpperCase())
}