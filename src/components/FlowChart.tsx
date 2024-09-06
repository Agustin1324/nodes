'use client'

import React, { useState, useCallback, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node, Edge, Background, Connection, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from '../app/page.module.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ReactFlow = dynamic(() => import('@xyflow/react').then((mod) => mod.ReactFlow), { ssr: false });

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

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

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    try {
      setAiResponse('Generating response...');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      const text = response.text();
      setAiResponse(text);

      // No longer creating a new node here
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
        </div>
        <div className={styles.rightPanel}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;