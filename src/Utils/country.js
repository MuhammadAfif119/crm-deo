import { Badge } from '@chakra-ui/react'
import React from 'react'

export const getCountry =  (data) => {

  if(data==='1688' || data==='taobao'){
    return <Badge bgColor='red.300' size={'md'}>CN 🇨🇳</Badge>
  }
}
