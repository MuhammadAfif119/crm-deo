import React, { memo, useCallback, useEffect, useState } from 'react';
import { Handle, NodeResizer, Position } from 'reactflow';
import cx from 'classnames';

import styles from './NodeTypes.module.css';
import useNodeClick from './useNodeClick';
import { Button, Center, HStack, Input, Textarea} from '@chakra-ui/react';
import { useFlowchartStore } from '../../Hooks/Zustand/reactFlow';
import { useGlobalState } from '../../Hooks/Contexts';
import { useParams } from 'react-router-dom';
import { getSingleDocumentFirebase } from '../../Apis/firebaseApi';
import ResizableNodeSelected from './ResizableNodeSelected';
import CustomResizerNode from './CustomResizerNode';
import { FaPlusCircle } from 'react-icons/fa';

const WorkflowNode = ({id, data}) => {
  const params = useParams()
  const [map, setMap] = useState()
  const initialNodeSize = { width: 200, height: 100 };
  const [nodeSize, setNodeSize] = useState(initialNodeSize)
	const globalState = useGlobalState();
    const selector = (state) => ({
        updateNodeLabel: state.updateNodeLabel
    })

    const getMindmap = async () => {
      try {
        const res = await getSingleDocumentFirebase('flowcharts', params.id)
        setMap(res)
      } catch (error) {
        console.log(error)
      }
    }

    const handleResize = (newWidth, newHeight) => {
      const minWidth = 100;
      const minHeight = 30;
    
      const width = Math.max(newWidth, minWidth);
      const height = Math.max(newHeight, minHeight);
    
      setNodeSize({ width, height });
    };

    useEffect(() => {
    getMindmap()
    }, [])

const { updateNodeLabel } = useFlowchartStore(selector)
const onClick = useNodeClick(id);
const onChange = useCallback((evt) => {
    updateNodeLabel(id, evt.target.value);
}, [id]);
  const [selectedNode, setSelectedNode] = useState(null)
  const [border, setBorder] = useState(null)

  const handleNodeClick = () => {
    // console.log(data,'xxx')
    // if (data) {
    //   setSelectedNode(data)
    // }
    // if (selectedNode === data) {
    //   setBorder(cx(styles.node))
    // } else {
    //   setBorder(null)
    // }
    if (selectedNode === data) {
      setSelectedNode(null)
      setBorder(null)
    } else {
      setSelectedNode(data)
      setBorder(cx(styles.node))
    }
  }
  return (
    <>
    {map?.owner.includes(globalState.uid) ? 
    <>
    <HStack>
              {/* <NodeResizer color="#ff0071" isVisible={selectedNode === data} onResize={handleResize} maxHeight={90} maxWidth={300}/> */}
              <div onClick={handleNodeClick} className={border}  title="click to add a child node">
                  <Textarea 
                    placeholder='Add Label' 
                    fontSize={'8px'} 
                    border={'transparent'} 
                    value={data.label} 
                    onChange={onChange}
                    type='text'
                    color={'black'}
                    textAlign={'center'}
                    className="nodrag"
                    fontWeight={'500'}
                    style={{ resize: 'none' }}
                    variant={'unstyled'}
                    minH={0}
                    height={'40px'}
                    w={'180px'}
                    justifyContent={'center'}
                    alignItems={'center'}
                              
                    />
                  <Handle className={styles.handle} type="target" position={'left'} isConnectable={false} />
                  <Handle className={styles.handle} type="source" position={'right'} isConnectable={false} />
                  {/* <Handle type="source" position={Position.Top} id="a" />
                  <Handle type="source" position={Position.Right} id="b" />
                  <Handle type="source" position={Position.Bottom} id="c" />
                  <Handle type="source" position={Position.Left} id="d" /> */}
              </div>
          </HStack>
              {data === selectedNode?
              <Center my={1}>
                <Button variant={'outline'} colorScheme="blue" onClick={onClick} size={'xs'} fontSize={'8'} border={'transparent'} display={selectedNode === data ? 'block' : 'none'}>
                  <FaPlusCircle size={15}/>
                </Button>
              </Center> : <></>
            }
    </> 
    : 
    <>
    <HStack>
              <div className={cx(styles.node)} title="click to add a child node">
                  <Textarea 
                    placeholder='klik untuk mengisi' 
                    fontSize={'9px'} 
                    border={'transparent'} 
                    value={data.label} 
                    onChange={onChange} 
                    disabled={true}
                    />
                  <Handle className={styles.handle} type="target" position={Position.Top} isConnectable={false} />
                  <Handle className={styles.handle} type="source" position={Position.Bottom} isConnectable={false} />
              </div>
          </HStack>
    </>}
          
        </>
  );
};

export default WorkflowNode;