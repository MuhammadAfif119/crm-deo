import { Flex, Spacer, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import store from 'store'
import ApiBackend from '../Api/ApiBackend';
import AppSideAccountBar from '../Components/AppSideAccountBar';


function ReportsPage() {

  const [barStatus, setBarStatus] = useState(false)
  const contentWidth = barStatus ? "85%" : "95%";

  const height = window.innerHeight

  let [searchParams, setSearchParams] = useSearchParams();

  const profileKey = searchParams.get("detail")



    const getAnalytics = async () => {

        if(profileKey){
            try {
                const res = await ApiBackend.post('/analyticslinks', {
                    lastDays : 1,
                    profileKey
                })
                console.log(res, 'report')
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getAnalytics()
    
      return () => {
      }
    }, [profileKey])
    
  return (
    <>
            <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
                <Stack >
                    <AppSideAccountBar setBarStatus={setBarStatus} />
                </Stack>
                
                <Spacer/>

                <Stack w={contentWidth} transition={"0.2s ease-in-out"} minH={height} >
                    <Stack p={10} spacing={5}>

                      <Text>Report page</Text>

                    </Stack>
                </Stack>
            </Flex>

        </ >
  )
}

export default ReportsPage