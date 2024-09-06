'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node, Edge, Background, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from '../app/page.module.css';
import NodeCreator from './NodeCreator';

const ReactFlow = dynamic(() => import('@xyflow/react').then((mod) => mod.ReactFlow), { ssr: false });

const FlowChart: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = (changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const handleCreateNode = (nodeProperties: any) => {
    const newNode: Node = {
      id: nodeProperties.id,
      type: nodeProperties.type,
      position: nodeProperties.position,
      data: nodeProperties.data,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <ReactFlowProvider>
      <div className={styles.flowChartContainer}>
        <div className={styles.leftPanel}>
          <NodeCreator onCreateNode={handleCreateNode} />
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.componentTitle}>Flow Chart</div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            style={{ background: '#f0f0f0' }}
          >
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;