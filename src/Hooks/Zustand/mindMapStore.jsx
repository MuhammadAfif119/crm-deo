import { applyNodeChanges, applyEdgeChanges, MarkerType } from "reactflow"
import { create } from "zustand"
import { nanoid } from "nanoid/non-secure"
import { set, ref, onValue } from "firebase/database";
import { database } from "../../Config/firebase";

const handleRTDB = (location, data) => {
	set(ref(database, `8NCG4Qw0xVbNR6JCcJw1/mindmap/mindmapId/${location}`), data)
		.then((x) => {
			console.log('RTDB success', data)
		}).catch((error) => {
			console.log(error)
		});
}

const initialNodes = [
	{
	  id: '1',
	  label: '1',
	  position: { x: 0, y: 0 },
	  data: { label: 'Add' },
	  type: 'custom',
	},
	{
	  id: '2',
	  label: '2',
	  position: { x: 0, y: 200 },
	  data: { label: 'Add' },
	  type: 'custom',
	},
  ]

  const initialEdges = [
	{
	  id: '1-2',
	  source: '1',
	  target: '2',
	  sourceHandle: 'c',
	  targetHandle: 'a',
	  type: 'floating',
	  color: 'black',
	  markerEnd: { type: MarkerType.ArrowClosed },
	},
  ];

const useMindMapStore = create((set, get) => ({
	nodes: initialNodes,
	edges: initialEdges,
	title : '',
	owner : '',
	setInitialNodes: nodes => {
		set({
			nodes: nodes
		})
	},
	setInitialEdges: edges => {
		set({
			edges: edges
		})
	},
	onNodesChange: changes => {
		set({
			nodes: applyNodeChanges(changes, get().nodes)
		})
		// handleRTDB('nodes', applyNodeChanges(changes, get().nodes))

	},
	onEdgesChange: changes => {
		const currentEdges = get().edges
		set({
			edges: applyEdgeChanges(changes, currentEdges)
		})
		// handleRTDB('nodes', applyEdgeChanges(changes, currentEdges))
	},
	setOwner: (owner) => {
		set({
			 owner: owner
		})
   },
	onDrop: () => {
		handleRTDB('nodes', get().nodes)
	},
	addChildNode: (parentNode, position) => {
		const newNode = {
			id: nanoid(),
			type: "mindmap",
			data: { label: "New Node" },
			position,
			parentNode: parentNode.id
		}

		const newEdge = {
			id: nanoid(),
			source: parentNode.id,
			target: newNode.id
		}

		const oldNodes = get().nodes
		const oldEdges = get().edges

		// set({
		// 	nodes: [...oldNodes, newNode],
		// 	edges: [...oldEdges, newEdge]
		// })

		handleRTDB('nodes', [...oldNodes, newNode]
		)
		handleRTDB('edges', [...oldEdges, newEdge]
		)


	},
	updateNodeLabel: (nodeId, label) => {
		// set({
		// 	nodes: get().nodes.map(node => {
		// 		if (node.id === nodeId) {
		// 			// it's important to create a new object here, to inform React Flow about the changes
		// 			node.data = { ...node.data, label }
		// 		}
		// 		return node
		// 	})
		// })

		handleRTDB('nodes',
			get().nodes.map(node => {
				if (node.id === nodeId) {
					// it's important to create a new object here, to inform React Flow about the changes
					node.data = { ...node.data, label }
				}
				return node
			})

		)
	}
}))

export default useMindMapStore
