'use client'

import React, { useState, useCallback, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node, Edge, Background, Connection, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from '../app/page.module.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import InputNode from '@/app/nodes/InputNode';
import DisplayNode from '@/app/nodes/DisplayNode';
import UppercaseNode from '@/app/nodes/UppercaseNode';

const ReactFlow = dynamic(() => import('@xyflow/react').then((mod) => mod.ReactFlow), { ssr: false });

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const systemPrompt = `You are an AI assistant that creates custom nodes for a flow chart application. 
Your task is to generate a JSON object representing a custom node based on the user's input. 
The JSON should follow this structure:

{
  "id": "custom-node-[unique-id]",
  "type": "customNode",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "[Node Label]",
    "content": "[Brief description of the node]",
    "inputs": [
      { "id": "input-1", "label": "[Input 1 Label]", "dataType": "[Input 1 Data Type]" },
      { "id": "input-2", "label": "[Input 2 Label]", "dataType": "[Input 2 Data Type]" }
    ],
    "outputs": [
      { "id": "output-1", "label": "[Output 1 Label]", "dataType": "[Output 1 Data Type]" },
      { "id": "output-2", "label": "[Output 2 Label]", "dataType": "[Output 2 Data Type]" }
    ],
    "processFunction": "function processInputs(input1, input2) { /* Processing logic here */ }",
    "allowedInputTypes": ["[allowed input types]"],
    "outputTypes": ["[output types]"]
  },
  "style": {
    "background": "#f0f0f0",
    "color": "#333",
    "border": "1px solid #ccc",
    "borderRadius": "5px",
    "padding": "10px",
    "width": 200,
    "fontSize": "12px"
  },
  "sourcePosition": "right",
  "targetPosition": "left",
  "dragHandle": ".custom-drag-handle",
  "draggable": true,
  "selectable": true,
  "connectable": true
}

Generate appropriate values for all fields based on the user's input. Ensure that the 'id' field is unique.
Respond only with the JSON object, without any additional text or explanation.`;

const FlowChart: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

  const addInputNode = useCallback(() => {
    const newNode: Node = {
      id: `input-node-${nodes.length + 1}`,
      type: 'inputNode',
      data: { label: `Input Node ${nodes.length + 1}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

  const addDisplayNode = useCallback(() => {
    const newNode: Node = {
      id: `display-node-${nodes.length + 1}`,
      type: 'displayNode',
      data: { label: `Display Node ${nodes.length + 1}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

  const addUppercaseNode = useCallback(() => {
    const newNode: Node = {
      id: `uppercase-node-${nodes.length + 1}`,
      type: 'uppercaseNode',
      data: { label: `Uppercase Node ${nodes.length + 1}` },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    try {
      setAiResponse('Generating response...');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: aiPrompt }
      ]);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonResponse = JSON.parse(text);
        setAiResponse(JSON.stringify(jsonResponse, null, 2));
        
        // Create a new node based on the AI response
        const newNode: Node = {
          id: jsonResponse.id,
          type: jsonResponse.type,
          position: jsonResponse.position,
          data: jsonResponse.data,
          style: jsonResponse.style,
          sourcePosition: jsonResponse.sourcePosition,
          targetPosition: jsonResponse.targetPosition,
          dragHandle: jsonResponse.dragHandle,
          draggable: jsonResponse.draggable,
          selectable: jsonResponse.selectable,
          connectable: jsonResponse.connectable,
        };
        setNodes((nds) => [...nds, newNode]);
      } catch (jsonError) {
        console.error('Error parsing AI response as JSON:', jsonError);
        setAiResponse('Error: AI response is not valid JSON');
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      setAiResponse('Error generating AI content. Please try again.');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAiGenerate();
    }
  };

  return (
    <ReactFlowProvider>
      <div className={styles.flowChartContainer}>
        <div className={styles.leftPanel}>
          <h1 className={styles.componentTitle}>Node Creator</h1>
          <div className={styles.aiInputContainer}>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter AI prompt for node generation"
              className={styles.aiInput}
            />
            <button onClick={handleAiGenerate} className={styles.aiGenerateButton}>
              AI Generate
            </button>
          </div>
          {aiResponse && (
            <div className={styles.aiResponseContainer}>
              <h3>AI Response:</h3>
              <p>{aiResponse}</p>
            </div>
          )}
          <button className={styles.addNodeButton} onClick={addNode}>
            Add Node
          </button>
          <button className={styles.addNodeButton} onClick={addInputNode}>
            Add Input Node
          </button>
          <button className={styles.addNodeButton} onClick={addDisplayNode}>
            Add Display Node
          </button>
          <button className={styles.addNodeButton} onClick={addUppercaseNode}>
            Add Uppercase Node
          </button>
        </div>
        <div className={styles.rightPanel}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={{ 
              inputNode: InputNode,
              displayNode: DisplayNode,
              uppercaseNode: UppercaseNode
            }}
            fitView
            connectionMode="loose"  // This enables proximity connection
            defaultEdgeOptions={{
              type: 'smoothstep',  // This makes the connections look smoother
            }}
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;