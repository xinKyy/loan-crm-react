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
      <Row gutter={24}>
        <Space>
          <Card
            style={{ width: 300 }}
            title="已赠送LCC数量"
            extra={<div>今日数据</div>}
          >
            <Statistic
              extra="今日新增"
              value={40509}
              groupSeparator
              precision={2}
            />
          </Card>
          <Card
            style={{ width: 300 }}
            title="已充值LCC总量"
            extra={<div>今日数据</div>}
          >
            <Statistic
              extra="今日新增"
              value={40509}
              groupSeparator
              precision={2}
            />
          </Card>
          <Card
            style={{ width: 300 }}
            title="已提供帮助总量"
            extra={<div>今日数据</div>}
          >
            <Statistic
              extra="今日新增"
              value={40509}
              groupSeparator
              precision={2}
            />
          </Card>
        </Space>
      </Row>
      <Row style={{ marginTop: '10px' }} gutter={24}>
        <Overview />
      </Row>
    </div>
  );
}

export default Workplace;
