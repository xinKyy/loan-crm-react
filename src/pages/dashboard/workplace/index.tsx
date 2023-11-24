import React from 'react';
import { Card, Grid, Space, Statistic } from '@arco-design/web-react';
import PopularContents from './popular-contents';
import ContentPercentage from './content-percentage';
import Shortcuts from './shortcuts';
import Announcement from './announcement';
import Carousel from './carousel';
import Docs from './docs';
import styles from './style/index.module.less';
import './mock';
import dynamic from 'next/dynamic';
const Overview = dynamic(() => import('./overview'), { ssr: false });

const { Row, Col } = Grid;

const gutter = 16;

function Workplace() {
  return (
    <div className={styles.wrapper}>
      <Overview />
    </div>
  );
}

export default Workplace;
