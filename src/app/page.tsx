'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const FlowChart = dynamic(() => import('../components/FlowChart'), { ssr: false });

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.leftHalf}>
        {/* New component will go here */}
        <h2>Left Half Component</h2>
        <p>Add your new component here</p>
      </div>
      <div className={styles.rightHalf}>
        <FlowChart />
      </div>
    </main>
  );
}