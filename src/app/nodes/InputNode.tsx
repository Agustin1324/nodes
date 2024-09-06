import React, { useState, ChangeEvent } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

interface InputNodeProps {
  id: string;
  data: {
    label: string;
    inputValueA?: string;
    inputValueB?: string;
  };
}

function InputNode({ id, data }: InputNodeProps) {
  const { setNodes } = useReactFlow();
  const [inputValueA, setInputValueA] = useState(data.inputValueA || '');
  const [inputValueB, setInputValueB] = useState(data.inputValueB || '');

  const handleInputChange = (field: 'A' | 'B') => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (field === 'A') {
      setInputValueA(newValue);
    } else {
      setInputValueB(newValue);
    }
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, [`inputValue${field}`]: newValue };
        }
        return node;
      })
    );
  };

  return (
    <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '5px', border: '1px solid #ccc', width: '200px' }}>
      <div style={{ color: 'black', marginBottom: '5px' }}>{data.label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <input
          type="text"
          value={inputValueA}
          onChange={handleInputChange('A')}
          placeholder="Input A"
          style={{
            width: '100%',
            color: 'black',
            backgroundColor: 'white'
          }}
        />
        <input
          type="text"
          value={inputValueB}
          onChange={handleInputChange('B')}
          placeholder="Input B"
          style={{
            width: '100%',
            color: 'black',
            backgroundColor: 'white'
          }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ left: '75%' }} />
    </div>
  );
}

export default InputNode;