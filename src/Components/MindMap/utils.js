const uuid = () => new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

const color = [
  'red',
  'yellow',
  'green',
  'blue',
  'black',
  'grey',
  'orange',
  'purple',
  'pink',
  'brown',
  'peru',
  'coral',
  'salmon'
]

const randomColor = () => {
  return color[~~(Math.random()*color.length)]
}
  
  export { uuid, randomColor };