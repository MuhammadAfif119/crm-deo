import React, { useCallback, useState } from "react";
import { Background, ConnectionMode, Controls, MiniMap, Panel, Position, ReactFlow, ReactFlowProvider, getConnectedEdges, getIncomers, getOutgoers, useReactFlow, useStoreApi, ConnectionLineType, MarkerType } from "reactflow";
import { Avatar, AvatarGroup, Box, Button, Center, Divider, Flex, HStack, Heading, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Stack, Text, useToast, SimpleGrid, Accordion, AccordionButton, AccordionItem, AccordionIcon, AccordionPanel } from "@chakra-ui/react";
import edgeTypes from "../../Components/MindMap/EdgeType";
import useUndoRedo from "../../Components/MindMap/useUndoRedo";
import { useFlowchartStore } from "../../Hooks/Zustand/reactFlow";
import { FcDownload, FcEditImage, FcRedo, FcShare, FcUndo } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import nodeTypes from "../../Components/MindMap/NodeType";
import { toPng } from "html-to-image";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { db } from "../../Config/firebase";
import "./index.css"
import 'reactflow/dist/style.css';


import {
    doc,
    onSnapshot,
} from "firebase/firestore";
import { arrayUnionFirebase, setDocumentFirebase } from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { clientTypessense } from "../../Api/Typesense";
import BackButtons from "../../Components/Buttons/BackButtons";

function Mindmap() {
    const params = useParams()
    const selector = (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        setNodes: state.setNodes,
        setEdges: state.setEdges,
        title: state.title,
        setTitle: state.setTitle,
        owner: state.owner,
        setOwner: state.setOwner,
    })
    const toast = useToast()
    const navigate = useNavigate()
    const [data, setData] = useState()
    const globalState = useUserStore();
    const [access, setAccess] = useState()
    const [searchResult, setSearchResult] = useState()
    const [modalProjectUser, setModalProjectUser] = useState()
    const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo()
    const [selectedUserProjectIds, setSelectedUserProjectIds] = useState([]);
    const { nodes, edges, onConnect, setNodes, setEdges, onEdgesChange, onNodesChange, title, setTitle, owner, setOwner } = useFlowchartStore(selector)

    const getMindmap = async () => {
        try {
            const docRef = doc(db, "productions", params.id);

            // Gunakan onSnapshot untuk memantau perubahan data secara real-time
            onSnapshot(docRef, (docDAta) => {
                if (docDAta.exists()) {
                    const res = docDAta.data();
                    setNodes(res.nodes);
                    setEdges(res.edges);
                    setTitle(res.title);
                    setOwner(res.owner.includes(globalState.uid));
                    setData(res);
                } else {
                    // Dokumen tidak ditemukan
                    console.log("Dokumen tidak ditemukan");
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMindmap()
    }, [])

    const proOptions = { account: 'paid-pro', hideAttribution: true };

    const onNodeDragStart = useCallback(() => {
        takeSnapshot();
    }, [takeSnapshot]);

    const onSelectionDragStart = useCallback(() => {
        takeSnapshot();
    }, [takeSnapshot]);

    const fitViewOptions = {
        padding: 0.95,
    }

    const downloadButton = async () => {
        const imageWidth = 1024;
        const imageHeight = 768;

        const downloadImage = (dataUrl) => {
            const a = document.createElement('a');
            a.setAttribute('download', `${title}.png`);
            a.setAttribute('href', dataUrl);
            a.click();
        }
        const dataUrl = await toPng(document.querySelector('.react-flow__renderer'), {
            style: {
                width: imageWidth,
                height: imageHeight,
            },
        })
        downloadImage(dataUrl)
    }

    const handleData = () => {
        const newData = {
            edges: edges,
            nodes: nodes,
            lastUpdated: new Date(),
            lastUpdatedBy: {
                uid: globalState.uid,
                email: globalState.email,
            },
        };

        console.log(newData, 'ini new data')
    }

    const onNodesDelete = useCallback((deleted) => {
        // 👇 make deleting nodes undoable
        takeSnapshot();

        setEdges(
            deleted.reduce((acc, node) => {
                const incomers = getIncomers(node, nodes, edges);
                const outgoers = getOutgoers(node, nodes, edges);
                const connectedEdges = getConnectedEdges([node], edges);

                const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

                const createdEdges = incomers.flatMap(({ id: source }) =>
                    outgoers.map(({ id: target }) => ({ id: `reactflow__edge-${source}-${target}`, source, target }))
                );

                return [...remainingEdges, ...createdEdges];
            }, edges)
        );
    }, [takeSnapshot, nodes, edges]);

    const onEdgesDelete = useCallback(() => {
        takeSnapshot();
    }, [takeSnapshot]);

    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const connectionLineStyle = { stroke: randomColor, strokeWidth: 5 }
    const defaultEdgeOptions = {
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
   };

    const save = async () => {
        const newData = {
            edges: edges,
            nodes: nodes,
            lastUpdated: new Date(),
            lastUpdatedBy: {
                uid: globalState.uid,
                email: globalState.email,
            },
        };
        try {
            const res = await setDocumentFirebase('productions', params.id, newData, globalState.currentCompany)
            if (res) {
                toast({
                    title: 'Saved',
                    description: res.message,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
                // navigate('/mindmap')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const chunkArray = (arr, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const handleSearchUsers = (q) => {
        const companyUsers = globalState.companies.find((x) => x.id === globalState.currentCompany);
        const userChunks = chunkArray(companyUsers?.users, 100)
        const searchPromises = userChunks.map((userChunk) => {
            const searchParameters = {
                q: q,
                query_by: "name,email",
                filter_by: `id: [${userChunk.join(",")}]`,
                sort_by: "_text_match:desc"
            };
            return clientTypessense
                .collections("users")
                .documents()
                .search(searchParameters);
        });
        Promise.all(searchPromises)
            .then((results) => {
                const combinedResults = results.flatMap((result) => result.hits);
                setSearchResult(combinedResults);
            })
            .catch((error) => {
                console.error("Error performing search:", error);
            });
    };

    const handleUserProjectClick = (userId) => {
        setSelectedUserProjectIds((prevIds) => {
            if (prevIds.includes(userId)) {
                return prevIds.filter((id) => id !== userId);
            } else {
                return [...prevIds, userId];
            }
        });
    }

    const handleAddTeamProject = async () => {
        const collectionName = `flowcharts/${params.id}/users`;
        let docName = '';
        let data = '';
        const mapIdUser = selectedUserProjectIds.map((x) => x.id)
        const collectionNameArr = 'flowcharts';
        const arrDocName = `${params?.id}`;
        let field = '';
        const values = mapIdUser;

        switch (access) {
            case 'visitor':
                selectedUserProjectIds.forEach(async (x) => {
                    docName = x.id;
                    data = x;
                    try {
                        const result = await setDocumentFirebase(collectionName, docName, data);
                        console.log(result);

                        // Pesan toast yang berhasil
                    } catch (error) {
                        console.log('Terjadi kesalahan:', error);
                    }

                })

                field = 'users';
                try {
                    const result = await arrayUnionFirebase(collectionNameArr, arrDocName, field, values);
                    console.log(result); // Pesan toast yang berhasil
                    toast({
                        title: 'Success',
                        description: 'Success share this flowchart',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                    setModalProjectUser(false);
                    setSelectedUserProjectIds([]);
                    // setProjectActive("");
                    setSearchResult([]);
                    // getDataProjects();
                } catch (error) {
                    console.log('Terjadi kesalahan:', error);
                }
                break;
            case 'editor':
                selectedUserProjectIds.forEach(async (x) => {
                    docName = x.id;
                    data = x;
                    try {
                        const result = await setDocumentFirebase(collectionName, docName, data);
                        console.log(result);
                        // Pesan toast yang berhasil
                    } catch (error) {
                        console.log('Terjadi kesalahan:', error);
                    }

                })
                field = 'owner'
                try {
                    const result = await arrayUnionFirebase(collectionNameArr, arrDocName, 'owner', values);
                    console.log(result); // Pesan toast yang berhasil

                    const resultUser = await arrayUnionFirebase(collectionNameArr, arrDocName, 'users', values);
                    console.log(result, resultUser); // Pesan toast yang berhasil

                    setModalProjectUser(false);
                    setSelectedUserProjectIds([]);
                    setSearchResult([]);
                    toast({
                        title: 'Success',
                        description: 'Success share this flowchart',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                } catch (error) {
                    console.log('Terjadi kesalahan:', error);
                }

                break;
            default:
                toast({
                    title: 'Error',
                    description: 'You should give users an access',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                break;
        }
    }



    const PanelControl = () => {
        if (data?.owner.includes(globalState.uid)) {

            return (
                <Panel position="top-right">
                    <HStack bgColor={'white'} p={2} px={7} borderRadius={'3xl'} boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'>
                        <Text color={'lightgrey'} size={'sm'}>{title}</Text>
                        <Center height='30px'>
                            <Divider orientation='vertical' />
                        </Center>
                        <Button bgColor={'transparent'} size={'sm'} onClick={downloadButton}>
                            <FcDownload />
                        </Button>
                        <Button bgColor={'transparent'} size={'sm'} disabled={canUndo} onClick={undo} >
                            <FcUndo />
                        </Button>
                        <Button bgColor={'transparent'} size={'sm'} disabled={canRedo} onClick={redo}>
                            <FcRedo />
                        </Button>
                        <Button bgColor={'transparent'} size={'sm'} onClick={() => setModalProjectUser(true)}>
                            <FcShare />
                        </Button>
                        <Button bgColor={'transparent'} size={'sm'} onClick={save}> Save </Button>
                    </HStack>
                </Panel>
            )
        } else {
            return (
                <Panel position="top-right">
                    <HStack bgColor={'white'} p={2} px={7} borderRadius={'3xl'} boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'>
                        <Text color={'lightgrey'} size={'sm'}>Panel Control</Text>
                        <Center height='30px'>
                            <Divider orientation='vertical' />
                        </Center>
                        <Button bgColor={'transparent'} size={'sm'} onClick={downloadButton}>
                            <FcDownload />
                        </Button>
                    </HStack>
                </Panel>
            )
        }
    }

    return (
        <Stack p={[1, 1, 5]} bgColor="white">
            <SimpleGrid columns={[1, 1, 2]} gap={5}>
                <Stack border={0.5} shadow="md" borderColor={'gray.400'} bgColor={"gray.300"} borderRadius={'lg'} h={'95vh'}>
                    <div className="simple-floatingedges">
                        <ReactFlow
                            fitView
                            nodes={nodes}
                            edges={edges}
                            defaultEdges={edges}
                            onConnect={onConnect}
                            edgeTypes={edgeTypes}
                            nodeTypes={nodeTypes}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            fitViewOptions={fitViewOptions}
                            onNodeDragStart={onNodeDragStart}
                            onNodesDelete={onNodesDelete}
                            onEdgesDelete={onEdgesDelete}
                            onSelectionDragStart={onSelectionDragStart}
                            proOptions={proOptions}
                            defaultEdgeOptions={defaultEdgeOptions}
                            connectionMode={ConnectionMode.Loose}
                            connectionLineType={ConnectionLineType.Straight}
                            connectionLineStyle={connectionLineStyle}

                        >
                            <Controls />
                            <MiniMap />

                            <PanelControl />
                        </ReactFlow>
                    </div>

                    <Modal isOpen={modalProjectUser} onClose={() => setModalProjectUser(false)} isCentered size={'md'}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Mindmap Team</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Stack spacing={5} py={3}>
                                    <HStack m='1'>
                                        <Input type='text' placeholder='Search users' onChange={(e) => handleSearchUsers(e.target.value)} />
                                    </HStack>
                                    {searchResult?.length > 0 ?
                                        searchResult?.map((x, index) => {
                                            return (
                                                <HStack key={index} p='2' borderBottom='1px' >
                                                    <Avatar name={x.document.name} src={x.document.image ? x.document.image : ''} />
                                                    <Box>
                                                        <Text>{x.document.name}</Text>
                                                        <Text>{x.document.email}</Text>
                                                    </Box>
                                                    <Spacer />
                                                    <Button colorScheme='green' onClick={() => handleUserProjectClick(x.document)}>+</Button>
                                                </HStack>
                                            )
                                        })
                                        : <></>}
                                    <Stack gap='2'>

                                        <Box
                                            display={!owner && 'none'}
                                        >
                                            <HStack gap='2'

                                                p='4' rounded={5} borderWidth='1px' bgColor={access !== 'editor' ? 'white' : 'gray.100'} shadow={'md'} align={'left'} justify={'left'} cursor={'pointer'}
                                                _hover={access && access !== 'editor' && {
                                                    bg: "gray.100",
                                                    transform: "scale(1.02)",
                                                    transition: "0.3s",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => setAccess('editor')}
                                            >
                                                <Box>
                                                    <FcEditImage fontSize={'25'} />
                                                </Box>
                                                <Stack>
                                                    <Heading size={'sm'}>
                                                        Editor
                                                    </Heading>
                                                    <Text color={'gray.500'} fontSize={'sm'}>Users have access to edit and delete this flowchart</Text>
                                                </Stack>
                                            </HStack>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <Flex gap={5}>
                                    <AvatarGroup size='sm' gap='1' max={4}>
                                        {selectedUserProjectIds?.length > 0 &&
                                            selectedUserProjectIds?.map((x, i) => <Avatar key={i} name={x?.name} />)
                                        }
                                    </AvatarGroup>
                                    <Spacer />
                                    <Button
                                        leftIcon={<AddIcon boxSize={3} />}
                                        colorScheme="green"
                                        onClick={() => handleAddTeamProject()}
                                    >
                                        Add Team
                                    </Button>
                                    <Button
                                        leftIcon={<CloseIcon boxSize={3} />}
                                        colorScheme='red'
                                        onClick={() => {
                                            setModalProjectUser(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Flex>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Stack>
                <Stack border={0.5} shadow="md" borderColor={'gray.400'} borderRadius={'lg'} h={'95vh'} >
                    <Stack p={[1, 1, 5]}>
                        <Text fontSize={"xl"} fontWeight="bold">List Line</Text>
                        <Button onClick={() => handleData()} >Check</Button>
                        <Stack>
                            <Accordion defaultIndex={[0]} allowMultiple>

                                {nodes.length > 0 && (
                                    nodes.map((x, index) => {
                                        return (
                                            <AccordionItem key={index}>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box as="span" flex='1' textAlign='left'>
                                                            <Text textTransform={"capitalize"}>{x.data.label}</Text>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo consequat.
                                                </AccordionPanel>
                                            </AccordionItem>
                                        )
                                    })
                                )}
                            </Accordion>
                        </Stack>
                    </Stack>
                </Stack>
            </SimpleGrid>
        </Stack>
    )
}

function LineIndexPage() {
    return (
        <ReactFlowProvider>
            <BackButtons />
            <Mindmap />
        </ReactFlowProvider>
    );
}

export default LineIndexPage;

