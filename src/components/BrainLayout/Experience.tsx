"use client";
import Graph from "react-graph-vis";

const NeurodivergentExperienceDiagram = () => {
	const graph = {
		nodes: [
			{
				id: 1,
				label: "Neurodivergent\nExperience",
				shape: "circle",
				color: "#569FF6",
				font: { color: "black", size: 16 },
				size: 50
			},

			{ id: 2, label: "Cognitive\nProcessing", color: "#569CD6" },
			{ id: 21, label: "Bottom-Up\nThinking", color: "#9CDCFE" },
			{ id: 22, label: "Pattern\nRecognition", color: "#9CDCFE" },

			{ id: 3, label: "Adaptive\nStrategies", color: "#569CD6" },
			{ id: 31, label: "Masking", color: "#9CDCFE" },
			{ id: 32, label: "Hyperfocus", color: "#9CDCFE" },

			{ id: 4, label: "Sensory\nExperience", color: "#569CD6" },
			{ id: 41, label: "Sensory\nSensitivity", color: "#9CDCFE" },
			{ id: 42, label: "Emotional\nIntensity", color: "#9CDCFE" },

			{ id: 5, label: "Social\nDynamics", color: "#569CD6" },
			{ id: 51, label: "Social Cue\nInterpretation", color: "#9CDCFE" },
			{ id: 52, label: "Communication\nStyles", color: "#9CDCFE" },

			{ id: 6, label: "Executive\nFunctioning", color: "#569CD6" },
			{ id: 61, label: "Task\nManagement", color: "#9CDCFE" },
			{ id: 62, label: "Attention\nControl", color: "#9CDCFE" },

			{ id: 7, label: "Identity &\nSelf-Perception", color: "#569CD6" },
			{ id: 71, label: "Neurodiversity\nAcceptance", color: "#9CDCFE" },
			{ id: 72, label: "Strengths\nRecognition", color: "#9CDCFE" },

			{ id: 8, label: "Learning &\nSkill Acquisition", color: "#569CD6" },
			{ id: 81, label: "Specialized\nInterests", color: "#9CDCFE" },
			{ id: 82, label: "Unconventional\nLearning", color: "#9CDCFE" },

			{ id: 9, label: "Resilience\n& Growth", color: "#569CD6" },
			{ id: 91, label: "Adversity\nAdaptation", color: "#9CDCFE" },
			{ id: 92, label: "Self-Advocacy", color: "#9CDCFE" },

			{ id: 101, label: "Quick martial\narts learning", shape: "text", font: { color: "#CE9178", italic: true } },
			{
				id: 102,
				label: "Mimicking for\nsocial acceptance",
				shape: "text",
				font: { color: "#CE9178", italic: true }
			},
			{ id: 103, label: "Learning from\nChatGPT", shape: "text", font: { color: "#CE9178", italic: true } },
			{
				id: 104,
				label: "Trauma as catalyst\nfor growth",
				shape: "text",
				font: { color: "#CE9178", italic: true }
			},
			{ id: 105, label: "Habit tracking\nfor ADHD", shape: "text", font: { color: "#CE9178", italic: true } },
			{
				id: 106,
				label: "Everything as\npotential superpower",
				shape: "text",
				font: { color: "#CE9178", italic: true }
			}
		],
		edges: [
			// Main connections
			...[2, 3, 4, 5, 6, 7, 8, 9].map(id => ({ from: 1, to: id })),

			// Subcategory connections
			...[2, 3, 4, 5, 6, 7, 8, 9].flatMap(id => [
				{ from: id, to: id * 10 + 1 },
				{ from: id, to: id * 10 + 2 }
			]),

			// Additional connections
			{ from: 22, to: 81 },
			{ from: 31, to: 52 },
			{ from: 41, to: 32 },
			{ from: 61, to: 32 },
			{ from: 72, to: 81 },
			{ from: 82, to: 92 },
			{ from: 42, to: 62 },
			{ from: 21, to: 51 },

			// Example connections
			{ from: 22, to: 101, dashes: true },
			{ from: 31, to: 102, dashes: true },
			{ from: 82, to: 103, dashes: true },
			{ from: 91, to: 104, dashes: true },
			{ from: 61, to: 105, dashes: true },
			{ from: 72, to: 106, dashes: true }
		]
	};

	const options = {
		layout: {
			improvedLayout: true,
			hierarchical: false
		},
		edges: {
			color: "#CCCCCC",
			width: 1,
			smooth: {
				type: "continuous"
			}
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
		<div className="neurodivergent-experience-diagram">
			<Graph graph={graph} options={options} getNetwork={handleNetworkInit} />
		</div>
	);
};

export default NeurodivergentExperienceDiagram;
