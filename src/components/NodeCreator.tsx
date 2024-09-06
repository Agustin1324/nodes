import React, { useState } from 'react';
import styles from '../app/page.module.css';

interface NodeProperties {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
  style?: {
    backgroundColor?: string;
    color?: string;
    border?: string;
    width?: number;
    height?: number;
  };
  dragHandle?: boolean;
  selected?: boolean;
  isConnectable?: boolean;
  zIndex?: number;
  dragging?: boolean;
  targetPosition?: string;
  sourcePosition?: string;
}

const NodeCreator: React.FC<{ onCreateNode: (node: NodeProperties) => void }> = ({ onCreateNode }) => {
  const [nodeProperties, setNodeProperties] = useState<NodeProperties>({
    id: '',
    type: 'default',
    position: { x: 0, y: 0 },
    data: { label: '' },
    style: {
      backgroundColor: '#ffffff',
      color: '#333333',
      border: '1px solid #000000',
      width: 150,
      height: 40,
    },
    dragHandle: true,
    isConnectable: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNodeProperties(prev => {
      if (name === 'x' || name === 'y') {
        return { ...prev, position: { ...prev.position, [name]: Number(value) } };
      } else if (name.startsWith('style.')) {
        const styleProp = name.split('.')[1];
        return { ...prev, style: { ...prev.style, [styleProp]: value } };
      } else if (name === 'label') {
        return { ...prev, data: { ...prev.data, label: value } };
      } else if (type === 'checkbox') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      } else if (type === 'number') {
        return { ...prev, [name]: Number(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateNode(nodeProperties);
    // Reset form after submission
    setNodeProperties({
      id: '',
      type: 'default',
      position: { x: 0, y: 0 },
      data: { label: '' },
      style: {
        backgroundColor: '#ffffff',
        color: '#333333',
        border: '1px solid #000000',
        width: 150,
        height: 40,
      },
      dragHandle: true,
      isConnectable: true,
    });
  };

  return (
    <div className={styles.nodeCreator}>
      <h3>Create Custom Node</h3>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="text" name="id" value={nodeProperties.id} onChange={handleChange} required />
        </label>
        <label>
          Type:
          <input type="text" name="type" value={nodeProperties.type} onChange={handleChange} />
        </label>
        <label>
          Label:
          <input type="text" name="label" value={nodeProperties.data.label} onChange={handleChange} required />
        </label>
        <label>
          Position X:
          <input type="number" name="x" value={nodeProperties.position.x} onChange={handleChange} />
        </label>
        <label>
          Position Y:
          <input type="number" name="y" value={nodeProperties.position.y} onChange={handleChange} />
        </label>
        <label>
          Background Color:
          <input type="color" name="style.backgroundColor" value={nodeProperties.style?.backgroundColor} onChange={handleChange} />
        </label>
        <label>
          Text Color:
          <input type="color" name="style.color" value={nodeProperties.style?.color} onChange={handleChange} />
        </label>
        <label>
          Border:
          <input type="text" name="style.border" value={nodeProperties.style?.border} onChange={handleChange} />
        </label>
        <label>
          Width:
          <input type="number" name="style.width" value={nodeProperties.style?.width} onChange={handleChange} />
        </label>
        <label>
          Height:
          <input type="number" name="style.height" value={nodeProperties.style?.height} onChange={handleChange} />
        </label>
        <label>
          Drag Handle:
          <input type="checkbox" name="dragHandle" checked={nodeProperties.dragHandle} onChange={handleChange} />
        </label>
        <label>
          Is Connectable:
          <input type="checkbox" name="isConnectable" checked={nodeProperties.isConnectable} onChange={handleChange} />
        </label>
        <label>
          Z-Index:
          <input type="number" name="zIndex" value={nodeProperties.zIndex} onChange={handleChange} />
        </label>
        <label>
          Target Position:
          <select name="targetPosition" value={nodeProperties.targetPosition} onChange={handleChange}>
            <option value="">None</option>
            <option value="top">Top</option>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
          </select>
        </label>
        <label>
          Source Position:
          <select name="sourcePosition" value={nodeProperties.sourcePosition} onChange={handleChange}>
            <option value="">None</option>
            <option value="top">Top</option>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
          </select>
        </label>
        <button type="submit">Create Node</button>
      </form>
    </div>
  );
};

export default NodeCreator;