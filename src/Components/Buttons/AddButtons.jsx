import { Button, HStack, Heading, Spacer, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { FcPlus } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'

const AddButtons = ({type, link}) => {
     const navigate = useNavigate()
  return (
       <HStack>
            <Heading size={'md'}>
                 {type}
            </Heading>
            <Spacer />
            <Stack>
                 <Button onClick={() => navigate(link)} bgColor={'white'} shadow='md' variant='outline' borderColor='#F05A28' color='#F05A28'>
                      <HStack>
                           <FcPlus />
                           <Text>{type}</Text>
                      </HStack>
                 </Button>
            </Stack>
       </HStack>
  )
}

export default AddButtons