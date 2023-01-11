
function idrDecimalHelper(amount) {
  const numb = amount
  const format = numb.toString().split('').reverse().join('')
  const convert = format.match(/\d{1,3}/g)
  const rupiah = 'Rp ' + convert.join('.').split('').reverse().join('')

  return rupiah
}

export default idrDecimalHelper
