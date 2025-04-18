"use client";

import Graph from "react-graph-vis";

const AutismBrainGraph = () => {
	const graph = {
		nodes: [
			{ id: 1, label: "Autism & the Brain", color: "#60a5fa", shape: "circle", size: 50 },

			// Core concepts
			{ id: 2, label: "Theory of Mind", color: "#f87171" },
			{ id: 3, label: "Contextual Awareness", color: "#facc15" },
			{ id: 4, label: "Bottom-Up\nThinking", color: "#34d399" },
			{ id: 5, label: "‘Autós’ &\nOrigins", color: "#a78bfa" },
			{ id: 6, label: "Repetitive\nBehavior", color: "#fb923c" },
			{ id: 7, label: "Sensory\nSensitivity", color: "#38bdf8" },
			{ id: 8, label: "Slow Synaptic\nPruning", color: "#f472b6" }
		],
		edges: [
			{ from: 1, to: 2 },
			{ from: 1, to: 3 },
			{ from: 1, to: 4 },
			{ from: 1, to: 5 },
			{ from: 1, to: 6 },
			{ from: 1, to: 7 },
			{ from: 1, to: 8 }
		]
	};

	const options = {
		layout: {
			improvedLayout: true,
			hierarchical: false
		},
		edges: {
			color: "#ccc",
			width: 1,
			smooth: { type: "continuous" }
		},
		nodes: {
			shape: "box",
			margin: 10,
			borderWidth: 1,
			borderWidthSelected: 2,
			chosen: true,
			font: {
				color: "black",
				size: 14,
				face: "Consolas, 'Courier New', monospace",
				multi: "html",
				align: "center"
			},
			shadow: {
				enabled: true,
				color: "rgba(0,0,0,0.5)",
				size: 5,
				x: 2,
				y: 2
			}
		},
		physics: {
			forceAtlas2Based: {
				gravitationalConstant: -70,
				centralGravity: 0.01,
				springConstant: 0.08,
				springLength: 120,
				damping: 0.4,
				avoidOverlap: 0.8
			},
			maxVelocity: 50,
			minVelocity: 0.1,
			solver: "forceAtlas2Based",
			stabilization: {
				enabled: true,
				iterations: 1000,
				updateInterval: 100,
				fit: true
			}
		},
		interaction: {
			hover: true,
			tooltipDelay: 200,
			zoomView: true,
			zoomSpeed: 0.2,
			dragView: true,
			dragNodes: true
		},
		height: "600px",
		width: "100%"
	};

	const handleNetworkInit = (network: any) => {
		network.moveTo({
			scale: 2.0,
			animation: true
		});
	};

	return (
		<div className="autism-brain-graph">
			<Graph graph={graph} options={options} getNetwork={handleNetworkInit} />
		</div>
	);
};

export default AutismBrainGraph;
