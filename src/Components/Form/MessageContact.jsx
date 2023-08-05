import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import EmailSendgridChat from '../Chat/EmailSendgridChat'

function MessageContact({data, globalState}) {
    console.log(data, 'ini data')
    return (
        <Stack p={[1, 1, 5]}>
            <Stack>

            </Stack>
            <Stack>
                <Tabs isFitted variant='enclosed'>
                    <TabList  mb='1em'>
                        <Tab>Email</Tab>
                        <Tab>Message</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                           <EmailSendgridChat dataContact={data} globalState={globalState}/>
                        </TabPanel>
                        <TabPanel>
                            <p>two!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Stack>
        </Stack>

    )
}

export default MessageContact