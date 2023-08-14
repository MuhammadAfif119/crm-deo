import { Button, Stack } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Hooks/Zustand/Store';
import store from 'store';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../Config/firebase';

function ChatPageFirst() {
    const globalState = useUserStore();
    const [idMessage, setIdMessage] = useState("");
    const navigate = useNavigate();

    const param  = useParams()

    // Fungsi untuk melakukan sign-in anonim dan menyimpan UID dalam sesi
    const handleNewChatUser = async () => {

        if (globalState.uid === undefined) {
            try {
                const userCredential = await signInAnonymously(auth);
                const uid = userCredential.user.uid; // Ambil UID dari userCredential.user.uid
                // Simpan UID ke dalam sesi dengan batas waktu 1 jam
                const expirationTime = Date.now() + 3600 * 1000; // 1 jam dalam milidetik
                store.set("anonymousUid", uid);
                store.set("anonymousUidExpiration", expirationTime);

                return uid;
            } catch (error) {
                console.log(error);
                return null;
            }
        }else{
            return handleNewChat(globalState.name, globalState.uid)
        }

    };


    const handleNewChat = async (name, uid) => {
        const collectionName = 'messages';
        const data = {
            lastConversation: new Date(),
            last_chat: '',
            name: [name || `visitor`, 'admin123'],
            uids: [uid || `visitor`, 'admin'],
            projectId: globalState.currentProject,
            companyId: globalState.currentCompany
        };

        try {
            const docID = await addDocumentFirebase(collectionName, data, globalState.currentCompany);
            setIdMessage(docID);

            navigate(`/chat-user/${docID}`, { state: data });
        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }
    }

    return (
        <Stack>
            <Button onClick={() => handleNewChatUser()}>Chat</Button>
        </Stack>
    )
}

export default ChatPageFirst;
