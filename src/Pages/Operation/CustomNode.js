import {
  Box,
  Button,
  Center,
  Fade,
  HStack,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { Handle, Position } from "reactflow";
import useNodeClick from "../../Components/MindMap/useNodeClick";
import { useFlowchartStore } from "../../Hooks/Zustand/reactFlow";
import { DragHandleIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import useNodeClick2 from "../../Components/MindMap/useNodeClick2";
import useNodeClick3 from "../../Components/MindMap/useNodeClick3";
import useNodeClick4 from "../../Components/MindMap/useNodeClick4";
import useUserStore from "../../Hooks/Zustand/Store";
import { updateDocumentFirebase } from "../../Api/firebaseApi";

export default memo(({ id, data }) => {
  const toast = useToast();
  const selector = (state) => ({
    updateNodeLabel: state.updateNodeLabel,
    nodes: state.nodes,
    edges: state.edges,
  });
  const { updateNodeLabel, nodes, edges } = useFlowchartStore(selector);

  const nodeClick = useNodeClick(id)
  const nodeClick2 = useNodeClick2(id)
  const nodeClick3 = useNodeClick3(id)
  const nodeClick4 = useNodeClick4(id)


  const handleClick = (label) => {
    if(label === 1){
      nodeClick()
    }
    if(label === 2){
      nodeClick2()
    }
    if(label === 3){
      nodeClick3()
    }
    if(label === 4){
      nodeClick4()
    }

  } 

  const params = useParams();
  const globalState = useUserStore();


  const [selectedNode, setSelectedNode] = useState(null);
  const textareaRef = useRef(null);

  const handleNodeClick = () => {
    if (selectedNode === data) {
      setSelectedNode(null);
    } else {
      setSelectedNode(data);
      // save()
    }

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
      const res = await updateDocumentFirebase(
        "productions",
        params.id,
        newData,
        globalState.currentCompany
      );
      if (res) {
        console.log('auto save')
        // toast({
        //   title: "Saved",
        //   description: res.message,
        //   status: "success",
        //   duration: 9000,
        //   isClosable: true,
        // });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleChange = useCallback(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

    }

    // save()
  }, []);

  


  useEffect(() => {
    handleChange();
  }, []);

  const onChange = useCallback(
    async (evt) => {
      updateNodeLabel(id, evt.target.value);
    },
    [id]
  );

  return (
    <>
      <Box>
        <Center style={{ position: "absolute", top: "-30px", left: "45%" }}>
          <Button
            variant={"outline"}
            colorScheme="blue"
            onClick={() => handleClick(1)}
            size={"xs"}
            fontSize={"8"}
            border={"transparent"}
            display={selectedNode === data ? "block" : "none"}
          >
            <FaPlusCircle size={15} />
          </Button>
        </Center>

        <HStack>
          <Center style={{ position: "absolute", top: "25%", left: "-30px" }}>
            <Button
              variant={"outline"}
              colorScheme="blue"
              onClick={() => handleClick(2)}
              size={"xs"}
              fontSize={"8"}
              border={"transparent"}
              display={selectedNode === data ? "block" : "none"}
            >
              <FaPlusCircle size={15} />
            </Button>
          </Center>

          <Fade in={true} onClick={handleNodeClick} initialScale={3}>
            <Box
              display="flex"
              shadow="base"
              p="2"
              m="1"
              bgColor="white"
              minW="2xs"
              w={`${data.label.length * 10}px`}
              maxW={"md"}
            >
              <Box
                height="100%"
                margin-right="4px"
                align-items="center"
                justifyItems="center"
                pointer-events="all"
              >
                <DragHandleIcon />
              </Box>
              <Textarea
                fontSize="lg"
                type="text"
                value={data.label}
                // defaultValue={data.label}
                onChange={onChange}
                minW="fit-content"
                border="none"
                ref={textareaRef}
                rows={1}
                style={{ resize: "none", overflowY: "hidden", height: "auto" }}
              />
              <Handle type="source" position={Position.Top} id="a" />
              <Handle type="source" position={Position.Right} id="b" />
              <Handle type="source" position={Position.Bottom} id="c" />
              <Handle type="source" position={Position.Left} id="d" />
            </Box>
          </Fade>

          <Center style={{ position: "absolute", top: "25%", right: "-30px" }}>
            <Button
              variant={"outline"}
              colorScheme="blue"
              onClick={() => handleClick(3)}
              size={"xs"}
              fontSize={"8"}
              border={"transparent"}
              display={selectedNode === data ? "block" : "none"}
            >
              <FaPlusCircle size={15} />
            </Button>
          </Center>
        </HStack>

        <Center style={{ position: "absolute", bottom: "-30px", left: "45%" }}>
          <Button
            variant={"outline"}
            colorScheme="blue"
            onClick={() => handleClick(4)}
            size={"xs"}
            fontSize={"8"}
            border={"transparent"}
            display={selectedNode === data ? "block" : "none"}
          >
            <FaPlusCircle size={15} />
          </Button>
        </Center>
      </Box>
    </>
  );
});
