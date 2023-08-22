import { Box, Button, ButtonGroup, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDocumentFirebase, getCollectionFirebase } from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { BsFillChatDotsFill } from "react-icons/bs"
import MessageUser from "../../Components/Chat/MessageUser";

function ChatPageFirst({module, companyId, projectId}) {
    const globalState = useUserStore();
    const [idMessage, setIdMessage] = useState("");



    const navigate = useNavigate();

    const param = useParams()




    const initialFocusRef = useRef()



    const checkSessionStorageData = () => {
        const storedData = sessionStorage.getItem('dataChat');

        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const currentTime = new Date().getTime();

            if (currentTime < parsedData.expiration) {
                // Data masih berlaku, gunakan nilai uid dari sessionStorage

                handleLoadChat(parsedData)

                return true
            } else {
                // Data sudah kadaluwarsa, hapus dari sessionStorage
                sessionStorage.removeItem('dataChat');
                return false
            }
        } else {
            return false
        }
    };



    const saveDataToSessionStorage = (key, name, id) => {
        const currentTime = new Date().getTime();
        const expirationTime = currentTime + 15 * 60 * 1000; // 15 menit dalam milidetik
        const dataToStore = {
            name: name,
            uid: id,
            expiration: expirationTime
        };
        sessionStorage.setItem(key, JSON.stringify(dataToStore));
    };

    const handleChatButtonClick = async () => {
        // Cek session sebelum menindaklanjuti tombol "Chat"
        const res = checkSessionStorageData();

        if (res) {
            return
        }

        if (globalState.uid === "") {
            try {
                const idTime = moment(new Date()).valueOf();

                // Simpan data ke sessionStorage
                saveDataToSessionStorage('dataChat', "visitor", idTime);

                console.log('dataChat', "visitor", idTime, 'ini save visitor');
                handleNewChat("visitor", idTime);

            } catch (error) {
                console.log(error);
                return null;
            }
        } else {

            saveDataToSessionStorage('dataChat', globalState.name, globalState.uid);

            handleNewChat(globalState.name, globalState.uid);


        }


    };

    const handleLoadChat = async (data) => {

        const conditions = [
            { field: "uids", operator: "array-contains", value: data.uid },
            { field: "companyId", operator: "==", value: companyId },
            { field: "projectId", operator: "==", value: projectId },
        ];
        const sortBy = { field: "lastConversation", direction: "desc" };
        const limitValue = 1;

        try {
            const res = await getCollectionFirebase(
                "messages",
                conditions,
                sortBy,
                limitValue
            );

            const data = res[0]

            // navigate(`/chat-user/${data.id}`, { state: data });



            setIdMessage(data.id);



        } catch (error) {
            console.log(error, "ini error");
        }
    }

    const handleNewChat = async (name, uid) => {
        const collectionName = 'messages';
        const data = {
            lastConversation: new Date(),
            lastChat: '',
            module: module,
            name: [name, 'admin123'],
            uids: [uid, 'admin'],
            projectId: projectId,
            companyId: companyId
        };

        try {
            const docID = await addDocumentFirebase(collectionName, data, companyId);


            setIdMessage(docID);

            // navigate(`/chat-user/${docID}`, { state: data });
        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }
    }




    return (
        <Stack>
            <Stack bgColor={'transparent'} alignItems='flex-end' >
                <Stack bottom={5} right={5} p={[1, 1, 5]}>
                    <Popover
                        initialFocusRef={initialFocusRef}
                        placement='top'
                        closeOnBlur={false}
                    >

                        <PopoverTrigger  >

                            <Stack alignItems={'center'} justifyContent='center' onClick={() => handleChatButtonClick()} >
                                <Box p={5} borderRadius='full' bgColor='blue.700' _hover={{ transform: 'scale(1.05)' }} transition='0.3s ease-in-out' shadow={'md'} cursor='pointer' >
                                    <BsFillChatDotsFill color="white" size={30} />
                                </Box>
                            </Stack>
                        </PopoverTrigger>


                        <PopoverContent  bgColor='blue.200' width={'500px'}  mr={5} >
                            <MessageUser id={idMessage} companyId={companyId} />
                        </PopoverContent>


                    </Popover>
                </Stack>
            </Stack>


        </Stack>
    )
}

export default ChatPageFirst;
