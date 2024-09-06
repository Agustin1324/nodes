'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const FlowChart = dynamic(() => import('../components/FlowChart'), { ssr: false });

export default function Home() {
  return (
    <main className={styles.main}>
      <FlowChart />
    </main>
  );
}