import React, { useEffect } from 'react';
import { Handle, Position, useStore, useReactFlow } from '@xyflow/react';

interface UppercaseNodeProps {
  id: string;
  data: {
    label: string;
    uppercaseValue?: string;
  };
}

interface NodeData {
  label: string;
  inputValueA?: string;
  inputValueB?: string;
}

function UppercaseNode({ id, data }: UppercaseNodeProps) {
  const { setNodes } = useReactFlow();
  const connectedEdges = useStore((store) => 
    store.edges.filter((e) => e.target === id)
  );

  const uppercaseValue = useStore((store) => {
    if (connectedEdges.length === 0) return 'Not connected';
    const sourceNode = store.nodes.find((n) => n.id === connectedEdges[0].source);
    const sourceHandle = connectedEdges[0].sourceHandle;
    const nodeData = sourceNode?.data as NodeData;
    const value = sourceHandle === 'a' ? nodeData.inputValueA : nodeData.inputValueB;
    return value ? value.toUpperCase() : 'No value';
  });

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, uppercaseValue };
        }
        return node;
      })
    );
  }, [id, uppercaseValue, setNodes]);

  return (
    <div style={{ padding: '10px', background: '#d4edda', borderRadius: '5px', border: '1px solid #c3e6cb', width: '200px' }}>
      <Handle type="target" position={Position.Top} />
      <div style={{ color: 'black', marginBottom: '5px' }}>{data.label}</div>
      <div style={{ 
        color: 'black', 
        backgroundColor: 'white', 
        padding: '5px', 
        borderRadius: '3px', 
        border: '1px solid #c3e6cb' 
      }}>
        {uppercaseValue}
      </div>
      <Handle type="source" position={Position.Bottom} id="uppercase" />
    </div>
  );
}

export default UppercaseNode;