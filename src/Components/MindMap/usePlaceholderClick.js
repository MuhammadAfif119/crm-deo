import { Position, useReactFlow } from 'reactflow';

import { uuid, randomLabel } from './utils';

export function usePlaceholderClick(id) {
  const { getNode, setNodes, setEdges } = useReactFlow();

  const onClick = () => {
    const parentNode = getNode(id);

    if (!parentNode) {
      return;
    }

    const defaultPositions = {
      sourcePosition : Position.Right,
      targetPosition : Position.Left
    }
    const childPlaceholderId = uuid();

    const childPlaceholderNode = {
      id: childPlaceholderId,
      position: { x: parentNode.position.x, y: parentNode.position.y },
      type: 'placeholder',
      data: { label: '+' },
      ...defaultPositions
    };

    const childPlaceholderEdge = {
      id: `${parentNode.id}=>${childPlaceholderId}`,
      source: parentNode.id,
      target: childPlaceholderId,
      type: 'placeholder',
      ...defaultPositions
    };

    setNodes((nodes) =>
      nodes
        .map((node) => {
          if (node.id === id) {
            return {
              ...node,
              type: 'workflow',
              data: { label: 'add label' },
            };
          }
          return node;
        })
        .concat([childPlaceholderNode])
    );

    setEdges((edges) =>
      edges
        .map((edge) => {
          if (edge.target === id) {
            return {
              ...edge,
              type: 'workflow',
            };
          }
          return edge;
        })
        .concat([childPlaceholderEdge])
    );
  };

  return onClick;
}

export default usePlaceholderClick;