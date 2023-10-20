import { useCallback } from 'react';
import { useReactFlow, getOutgoers, Position } from 'reactflow';
import { randomColor, uuid } from './utils';


export function useNodeClick4(id) {
  const { setEdges, setNodes, getNodes, getEdges, getNode } = useReactFlow();

  const onClick = useCallback(() => {
    const parentNode = getNode(id);
    if (!parentNode) {
      return;
    }

    const childNodeId = uuid();
    const childPlaceholderId = uuid();

    const defaultPositions = {
      sourcePosition : Position.Right,
      targetPosition : Position.Left
    }

    const childNode = {
      id: childNodeId,
      position: { x: parentNode.position.x, y: parentNode.position.y + 200 },
      type: 'custom',
      data: { label: 'Add title' },
      ...defaultPositions
    };

    // const childPlaceholderNode = {
    //   id: childPlaceholderId,
    //   position: { x: childNode.position.x, y: childNode.position.y + 150 },
    //   type: 'placeholder',
    //   data: { label: '+' },
    //   ...defaultPositions
    // };

    const childEdge = {
      id: `${parentNode.id}=>${childNodeId}`,
      source: parentNode.id,
      target: childNodeId,
      type: 'floating',
      color: randomColor(),
      ...defaultPositions
    };

    // const childPlaceholderEdge = {
    //   id: `${childNodeId}=>${childPlaceholderId}`,
    //   source: childNodeId,
    //   target: childPlaceholderId,
    //   type: 'placeholder',
    //   ...defaultPositions
    // };

    const existingPlaceholders = getOutgoers(parentNode, getNodes(), getEdges())
      .filter((node) => node.type === 'placeholder')
      .map((node) => node.id);

    setNodes((nodes) =>
      nodes.filter((node) => !existingPlaceholders.includes(node.id)).concat([childNode])
    );

    setEdges((edges) =>
      edges.filter((edge) => !existingPlaceholders.includes(edge.target)).concat([childEdge])
    );
  }, [getEdges, getNode, getNodes, id, setEdges, setNodes]);

  return onClick;

  
}

export default useNodeClick4;