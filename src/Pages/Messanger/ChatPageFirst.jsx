import { Button, Stack } from '@chakra-ui/react'
import moment from 'moment';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { addDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Hooks/Zustand/Store';

function ChatPageFirst() {


    const globalState = useUserStore();

    const [idMessage, setIdMessage] = useState("")

    const navigate = useNavigate()





    const handleNewChat = async () => {

        const collectionName = 'messages';
        const data = {
            lastConversation: new Date(),
            last_chat: '',
            name: [globalState.name || `visitor`, 'admin123'],
            uids: [globalState.uid ||  `visitor`, 'admin'],
            projectId: globalState.currentProject,
            companyId: globalState.currentCompany
        };

        try {
            const docID = await addDocumentFirebase(collectionName, data, globalState.currentCompany);
            setIdMessage(docID);

            navigate(`/chat-user/${docID}`, {state : data })




        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }


    }


    return (
        <Stack>
            <Button onClick={() => handleNewChat()}>Chat</Button>
        </Stack>
    )
}

export default ChatPageFirst