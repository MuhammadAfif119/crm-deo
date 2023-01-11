// import { useEffect,useState } from "react"
import React from 'react'
// import { Ionicons } from '@expo/vector-icons'
import { BsPlus } from 'react-icons/bs'
import { BiMinus } from 'react-icons/bi'
import { Button, HStack, Icon, Input } from '@chakra-ui/react'

export default function ButtonQuantity ({quantity, pressButton}) {
  return(
    <HStack space={0.3} justifyContent="center" alignItems={'center'} px="2">
      <Button size="xs" variant="outline" onClick={() => pressButton(false)}>
        <Icon as={BiMinus} name="remove-outline" size="xs" color="#000" />
      </Button>
      <Input 
      alignItems={'center'}
      justifyContent='center'
      fontSize={'xs'}
      value={quantity} 
      />
      <Button size="xs" variant="outline" onClick={() => pressButton(true)}>
        <Icon as={BsPlus} name="add-outline" size="xs" color="#000" />
      </Button>
    </HStack>
  )
}