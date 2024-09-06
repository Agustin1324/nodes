import React from 'react';
import { Handle, Position, useStore } from '@xyflow/react';

interface DisplayNodeProps {
  id: string;
  data: {
    label: string;
  };
}

interface NodeData {
  label: string;
  inputValueA?: string;
  inputValueB?: string;
  uppercaseValue?: string;
}

function DisplayNode({ id, data }: DisplayNodeProps) {
  const connectedEdges = useStore((store) => 
    store.edges.filter((e) => e.target === id)
  );

  const connectedNodeValues = useStore((store) => {
    if (connectedEdges.length === 0) return 'Not connected';
    const sourceNode = store.nodes.find((n) => n.id === connectedEdges[0].source);
    const sourceHandle = connectedEdges[0].sourceHandle;
    const nodeData = sourceNode?.data as NodeData;
    
    if (nodeData.uppercaseValue) {
      return nodeData.uppercaseValue;
    } else {
      const value = sourceHandle === 'a' ? nodeData.inputValueA : nodeData.inputValueB;
      return `${sourceHandle}: ${value || 'No value'}`;
    }
  });

  return (
    <div style={{ padding: '10px', background: '#e6f7ff', borderRadius: '5px', border: '1px solid #91d5ff' }}>
      <Handle type="target" position={Position.Top} />
      <div style={{ color: 'black', marginBottom: '5px' }}>{data.label}</div>
      <div style={{ 
        color: 'black', 
        backgroundColor: 'white', 
        padding: '5px', 
        borderRadius: '3px', 
        border: '1px solid #d9d9d9' 
      }}>
        {connectedNodeValues}
      </div>
    </div>
  );
}

export default DisplayNode;