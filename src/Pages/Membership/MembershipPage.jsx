import { Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import _axios from '../../Api/AxiosBarrier'
import BackButtons from '../../Components/Buttons/BackButtons'
import { formatFrice } from '../../Utils/Helper'

function MembershipPage() {

    const [membershipList, setMembershipList] = useState([])


    const getDataMembership = async() => {
       try {
        const res = await _axios.get('membershipList')
        setMembershipList(res.message)
       } catch (error) {
        console.log(error, 'ini error')
       } 
    }

    useEffect(() => {
        getDataMembership()
    
      return () => {
      }
    }, [])
    
  return (
    <Stack>
        <Stack p={[1, 1, 5]} spacing={5}>
            <HStack>
                <BackButtons/>
                <Heading size={'md'}>Membership</Heading>
            </HStack>
            <Stack>
                {membershipList.length > 0 && (
                    <SimpleGrid columns={[1, 2, 3]} gap={3}>
                        {membershipList?.map((x, index) => {
                            return(
                                <Stack key={index} bgColor='white' borderRadius={'md'} shadow='md' p={5} alignItems={'center'} justifyContent='center'>
                                    <Text textTransform={'capitalize'} fontWeight={500}>{x.package_name}</Text>
                                    <Heading size={'lg'}>Rp.{formatFrice(x.package_amount)}</Heading>
                                    <Text textTransform={'capitalize'}>{x.package_expired_duration || x.package_expired}</Text>
                                    <Text textTransform={'uppercase'}>{x.package_code}</Text>
                                </Stack>
                            )
                        })}
                    </SimpleGrid>
                )}
            </Stack>
        </Stack>
    </Stack>
  )
}

export default MembershipPage