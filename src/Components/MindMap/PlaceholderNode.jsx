import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import cx from 'classnames';

import styles from './NodeTypes.module.css';
import usePlaceholderClick from './usePlaceholderClick';
import { Textarea } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useGlobalState } from '../../Hooks/Contexts';
import { getSingleDocumentFirebase } from '../../Apis/firebaseApi';
import { useEffect } from 'react';

const PlaceholderNode = ({ id, data }) => {
  const params = useParams()
  const [map, setMap] = useState()
	const globalState = useGlobalState();
  const onClick = usePlaceholderClick(id);

  const getMindmap = async () => {
    try {
      const res = await getSingleDocumentFirebase('flowcharts', params.id)
      setMap(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
  getMindmap()
  }, [])

  const NodeComponent = () => {
    if (map?.owner.includes(globalState.uid)) {
      return(
        <div onClick={onClick} className={nodeClasses} title="click to add a node">
          {data.label}
          {/* <Textarea/> */}
          <Handle className={styles.handle} type="target" position={Position.Top} isConnectable={false} />
          <Handle className={styles.handle} type="source" position={Position.Bottom} isConnectable={false} />
        </div>
      )
    } else {
      return (
        <div className={nodeClasses} title="click to add a node">
          {data.label}
          {/* <Textarea/> */}
          <Handle className={styles.handle} type="target" position={Position.Top} isConnectable={false} />
          <Handle className={styles.handle} type="source" position={Position.Bottom} isConnectable={false} />
        </div>
      )
    }
  }

  const nodeClasses = cx(styles.node, styles.placeholder);

  return (
    <NodeComponent/>
  );
};

export default memo(PlaceholderNode);
// Anda dapat menggunakan komponen PlaceholderNode ini di proyek Anda dengan cara yang sama seperti sebelumnya. Pastikan Anda memiliki dependensi yang diperlukan dan mengatur tata letak komponen dengan benar.





