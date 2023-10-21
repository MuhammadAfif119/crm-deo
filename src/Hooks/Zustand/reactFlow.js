import create from "zustand";
import {
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
  MarkerType,
} from "reactflow";

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = [
  {
    id: "1",
    label: "1",
    position: { x: 0, y: 0 },
    data: { label: "Add" },
    type: "custom",
  },
  {
    id: "2",
    label: "2",
    position: { x: 0, y: 200 },
    data: { label: "Add" },
    type: "custom",
  },
];

const initialEdges = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    sourceHandle: "c",
    targetHandle: "a",
    type: "floating",
    color: "black",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export const useFlowchartStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  title: "",
  owner: "",
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    const { source, target, sourceHandle, targetHandle } = connection;
    if (source && target) {
      const edgeIdExists = get().edges.some(
        (edge) => edge.id === `reactflow__edge-${source}-${target}`
      );
      const newEdgeId = edgeIdExists
        ? `reactflow__edge-${source}-${target}-${sourceHandle}`
        : `reactflow__edge-${source}-${target}`;
      set((state) => ({
        edges: [
          ...state.edges,
          {
            id: newEdgeId,
            source,
            target,
            sourceHandle,
            targetHandle,
            type: "floating",
            markerEnd: { type: MarkerType.Arrow },
          },
        ],
      }));
    }
  },

  updateNodeLabel: (id, label) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          // Penting untuk membuat objek baru di sini agar React Flow mengetahui perubahan
          node.data = { ...node.data, label: label };
        }
        return node;
      }),
    });
  },

  setNodes: (data) => {
    set({
      nodes: data,
    });
  },
  setEdges: (data) => {
    set({
      edges: data,
    });
  },

  setlatestId: (data) => {
    set({
      latestId: data,
    });
  },
  setTitle: (title) => {
    set({
      title: title,
    });
  },
  setOwner: (owner) => {
    set({
      owner: owner,
    });
  },
}));
