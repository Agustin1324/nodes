'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node, Edge, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Add this import

const ReactFlow = dynamic(() => import('@xyflow/react').then((mod) => mod.ReactFlow), { ssr: false });

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, style: { background: '#6ede87', color: '#333' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Node 2' }, style: { background: '#6865A5', color: '#fff' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', style: { stroke: '#FF6B6B', strokeWidth: 2 } },
];

const FlowChart: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          style={{ background: '#f0f0f0' }}
        >
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;