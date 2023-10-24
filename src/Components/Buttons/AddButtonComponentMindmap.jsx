import {
     Button, HStack, Heading, Spacer, Stack, Text, Modal,
     ModalOverlay,
     ModalContent,
     ModalHeader,
     ModalFooter,
     ModalBody,
     ModalCloseButton,
     useDisclosure,
     Input,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FcPlus } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { MarkerType, Position } from 'reactflow'
import { addDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi'
import useUserStore from '../../Hooks/Zustand/Store'


const AddButtonComponentMindmap = ({ type, link }) => {
     const navigate = useNavigate()
     const globalState = useUserStore();
     const { isOpen, onOpen, onClose } = useDisclosure()
     const [input, setInput] = useState('')

     const nodeDefaults = {
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
     }

     const handleClick = async () => {
          console.log(globalState, 'xxxco')
          const initialNodes = [
               {
                    id: '1',
                    label: '1',
                    position: { x: 0, y: 0 },
                    data: { label: 'Add' },
                    type: 'custom',
               },
               {
                    id: '2',
                    label: '2',
                    position: { x: 0, y: 200 },
                    data: { label: 'Add' },
                    type: 'custom',
               },
          ];

          const initialEdges = [
               {
                    id: '1-2',
                    source: '1',
                    target: '2',
                    sourceHandle: 'c',
                    targetHandle: 'a',
                    type: 'floating',
                    color: 'black',
                    markerEnd: { type: MarkerType.ArrowClosed },
               },
          ];

          addDocumentFirebase('productions', { owner: [globalState?.uid], users: [globalState?.uid], nodes: initialNodes, edges: initialEdges, title: input, type: type }, globalState?.currentCompany).then((res) => {
               setDocumentFirebase(`productions/${res}/users`, globalState?.uid, {email: globalState.email, name: globalState.name}).then(() => {

                    navigate(`${link}/${res}`)
               }).catch((error) => {
                    console.log("An error occurred while adding user data:", error);
               });
          }).catch((error) => {
               console.log("An error occurred while adding flowchart data:", error);
          });



     }
     return (
          <HStack>
               <Heading size={'md'} textTransform='capitalize'>
                    {type}
               </Heading>
               <Spacer />
               <Stack>
                    <Button onClick={() => onOpen()} bgColor={'white'} shadow='md' variant='outline' borderColor='#F05A28' color='#F05A28'>
                         <HStack>
                              <FcPlus />
                              <Text textTransform={'capitalize'}>{type}</Text>
                         </HStack>
                    </Button>
               </Stack>
               <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader>Add {type}</ModalHeader>
                         <ModalCloseButton />
                         <ModalBody>
                              <Input type='text' onChange={e => setInput(e.target.value)} />
                         </ModalBody>

                         <ModalFooter>
                              <Button nvariant={'outline'} colorScheme="blue" onClick={() => handleClick()}>Add</Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </HStack>
     )
}

export default AddButtonComponentMindmap