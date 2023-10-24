import { Position, useReactFlow } from 'reactflow';

import { uuid, randomLabel, randomColor } from './utils';

function useEdgeClick(id) {
  const { setEdges, setNodes, getNode, getEdge } = useReactFlow();

  const handleEdgeClick = () => {
    const edge = getEdge(id);

    if (!edge) {
      return;
    }

    const targetNode = getNode(edge.target);

    if (!targetNode) {
      return;
    }

    const defaultPositions = {
      sourcePosition : Position.Right,
      targetPosition : Position.Left
    }

    const insertNodeId = uuid();

    const insertNode = {
      id: insertNodeId,
      position: { x: targetNode.position.x, y: targetNode.position.y },
      data: { label: 'add title' },
      type: 'workflow',
      ...defaultPositions
    };

    const sourceEdge = {
      id: `${edge.source}->${insertNodeId}`,
      source: edge.source,
      target: insertNodeId,
      type: 'workflow',
      ...defaultPositions
    };

    const targetEdge = {
      id: `${insertNodeId}->${edge.target}`,
      source: insertNodeId,
      target: edge.target,
      type: 'workflow',
      color: randomColor(),
      ...defaultPositions
    };

    setEdges((edges) => edges.filter((e) => e.id !== id).concat([sourceEdge, targetEdge]));

    setNodes((nodes) => {
      const targetNodeIndex = nodes.findIndex((node) => node.id === edge.target);

      return [...nodes.slice(0, targetNodeIndex), insertNode, ...nodes.slice(targetNodeIndex, nodes.length)];
    });
  };

  return handleEdgeClick;
}

export default useEdgeClick;