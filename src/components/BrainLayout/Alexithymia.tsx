"use client";

import Graph from "react-graph-vis";

const AlexithymiaGraph = () => {
	const graph = {
		nodes: [
			{ id: 1, label: "Alexithymia", color: "#569FF6", shape: "circle", size: 50 },

			// Main categories
			{ id: 2, label: "Definition", color: "#569CD6" },
			{ id: 3, label: "Causes", color: "#f59e0b" },
			{ id: 4, label: "Symptoms", color: "#ef4444" },
			{ id: 5, label: "Struggles", color: "#a855f7" },
			{ id: 6, label: "Comorbidities", color: "#10b981" },
			{ id: 7, label: "Quotes", color: "#64748b" },

			// Causes
			{ id: 31, label: "Environmental", color: "#fbbf24" },
			{ id: 32, label: "Neurological", color: "#fbbf24" },

			// Symptoms
			{ id: 41, label: "Emotional\nBlindness", color: "#fca5a5" },
			{ id: 42, label: "Somatic\nConfusion", color: "#fca5a5" },

			// Struggles
			{ id: 51, label: "Communication", color: "#c084fc" },
			{ id: 52, label: "Relationships", color: "#c084fc" },

			// Communication subnodes
			{ id: 511, label: "Scripts /\nRolodex", color: "#e9d5ff" },
			{ id: 512, label: "Literal\nUnderstanding", color: "#e9d5ff" },

			// Relationships subnodes
			{ id: 521, label: "Disconnection", color: "#e9d5ff" },
			{ id: 522, label: "Misreading\nSupport", color: "#e9d5ff" },

			// Comorbidities
			{ id: 61, label: "Autism", color: "#6ee7b7" },
			{ id: 62, label: "PTSD", color: "#6ee7b7" },
			{ id: 63, label: "Depression", color: "#6ee7b7" },

			// Quotes
			{
				id: 71,
				label: "“I am not a robot…”",
				shape: "text",
				font: { color: "#94a3b8", ital: true }
			},
			{
				id: 72,
				label: "“I use a rollodex\nof responses…”",
				shape: "text",
				font: { color: "#94a3b8", ital: true }
			}
		],
		edges: [
			// Main branches
			...["2", "3", "4", "5", "6", "7"].map(id => ({ from: 1, to: Number(id) })),

			// Causes
			{ from: 3, to: 31 },
			{ from: 3, to: 32 },

			// Symptoms
			{ from: 4, to: 41 },
			{ from: 4, to: 42 },

			// Struggles → subtopics
			{ from: 5, to: 51 },
			{ from: 5, to: 52 },

			// Communication → subtopics
			{ from: 51, to: 511 },
			{ from: 51, to: 512 },

			// Relationships → subtopics
			{ from: 52, to: 521 },
			{ from: 52, to: 522 },

			// Comorbidities
			{ from: 6, to: 61 },
			{ from: 6, to: 62 },
			{ from: 6, to: 63 },

			// Quotes
			{ from: 7, to: 71, dashes: true },
			{ from: 7, to: 72, dashes: true }
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
				gravitationalConstant: -50,
				centralGravity: 0.01,
				springConstant: 0.08,
				springLength: 100,
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
		<div className="alexithymia-graph">
			<Graph graph={graph} options={options} getNetwork={handleNetworkInit} />
		</div>
	);
};

export default AlexithymiaGraph;
