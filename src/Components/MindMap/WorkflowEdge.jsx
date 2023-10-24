import React from 'react';
import { getBezierPath } from 'reactflow';

import styles from './EdgeTypes.module.css';
import useEdgeClick from './useEdgeClick';
import { randomColor } from './utils';
import { memo } from 'react';
import { useFlowchartStore } from '../../Hooks/Zustand/reactFlow';
import { useState } from 'react';

const WorkflowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}) => {
  const onClick = useEdgeClick(id);
  const selector = (state) => ({
		edges: state.edges,
	})
  const [color, setColor] = useState()
  const {edges} = useFlowchartStore(selector)
  // const colors = () => {
  //   const res = edges.find(x => x.id === id)
  //   setColor(res.)
  // }

  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path id={id} style={style} className={styles.edgePath} stroke={randomColor()} d={edgePath} markerEnd={markerEnd} />
      {/* <g transform={`translate(${edgeCenterX}, ${edgeCenterY})`}>
        <rect onClick={onClick} x={-10} y={-10} width={20} ry={4} rx={4} height={20} className={styles.edgeButton} />
        <text className={styles.edgeButtonText} y={5} x={-4}>
          +
        </text>
      </g> */}
    </>
  );
}

export default memo(WorkflowEdge) 