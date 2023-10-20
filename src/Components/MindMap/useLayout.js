import { useEffect, useRef } from 'react';
import { useReactFlow, useStore } from 'reactflow';
import { stratify, tree } from 'd3-hierarchy';
import { timer } from 'd3-timer';
import Tree from 'react-d3-tree';

const layout = tree()
  .nodeSize([200, 150])
  .separation(() => 1);

const options = { duration: 300 };

function layoutNodes(nodes, edges) {
  if (nodes.length === 0) {
    return [];
  }
  
  const hierarchy = stratify()
    .id(d => d.id)
    .parentId(d => edges.find(e => e.target === d.id)?.source)(nodes);

  const root = layout(hierarchy);

  return root.descendants().map(d => ({ ...d.data, position: { x: d.y, y: d.x } }));
}

const nodeCountSelector = state => state.nodeInternals.size;

function useLayout() {
  const initial = useRef(true);
  const nodeCount = useStore(nodeCountSelector);

  const { getNodes, getNode, setNodes, setEdges, getEdges, fitView } = useReactFlow();
  useEffect(() => {
    const nodes = getNodes();
    const edges = getEdges();

    const targetNodes = layoutNodes(nodes, edges);

    const transitions = targetNodes.map(node => {
      return {
        id: node.id,
        from: getNode(node.id)?.position || node.position,
        to: node.position,
        node,
      };
    });

    const t = timer(elapsed => {
      const s = elapsed / options.duration;

      const currNodes = transitions.map(({ node, from, to }) => {
        return {
          id: node.id,
          position: {
            x: from.y + (to.y - from.y) * s,
            y: from.x + (to.x - from.x) * s,
          },
          data: { ...node.data },
          type: node.type,
        };
      });

      setNodes(currNodes);

      if (elapsed > options.duration) {
        const finalNodes = transitions.map(({ node, to }) => {
          return {
            id: node.id,
            position: {
              x: to.y,
              y: to.x,
            },
            data: { ...node.data },
            type: node.type,
          };
        });

        setNodes(finalNodes);

        t.stop();

        if (!initial.current) {
          fitView({ duration: 200, padding: 0.2 });
        }
        initial.current = false;
      }
    });

    return () => {
      t.stop();
    };
  }, [nodeCount, getEdges, getNodes, getNode, setNodes, fitView, setEdges]);
}

export default useLayout;