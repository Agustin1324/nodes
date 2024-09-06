'use client'

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node, Edge, Background, Connection, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from '../app/page.module.css';

const ReactFlow = dynamic(() => import('@xyflow/react').then((mod) => mod.ReactFlow), { ssr: false });

const FlowChart: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');

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
    // TODO: Implement AI generation logic here
    console.log('AI Generate with prompt:', aiPrompt);
    // For now, we'll just add a node with the AI prompt as the label
    const newNode: Node = {
      id: `ai-node-${nodes.length + 1}`,
      data: { label: aiPrompt },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    setNodes((nds) => [...nds, newNode]);
    setAiPrompt('');
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
              placeholder="Enter AI prompt for node generation"
              className={styles.aiInput}
            />
            <button onClick={handleAiGenerate} className={styles.aiGenerateButton}>
              AI Generate
            </button>
          </div>
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