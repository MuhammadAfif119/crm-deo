import React from 'react';
import { getBezierPath } from 'reactflow';

import styles from './EdgeTypes.module.css';

export default function PlaceholderEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return <path id={id} style={style} className={styles.placeholderPath} d={edgePath} markerEnd={markerEnd} />;
}