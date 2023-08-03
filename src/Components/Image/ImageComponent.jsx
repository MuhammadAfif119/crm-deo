import { Image } from '@chakra-ui/react'
import React from 'react'

function ImageComponent(props) {
  return (
	<Image src={props.image?props.image:'https://storage.googleapis.com/deoapp-indonesia.appspot.com/asset/noimage_800x800.jpeg'} alt={props.name} w={props.width?props.width:'full'}/>
	)
}

export default ImageComponent