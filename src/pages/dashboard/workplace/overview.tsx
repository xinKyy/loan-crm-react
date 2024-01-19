import React, { useState, useEffect, ReactNode } from 'react';
import {
  Grid,
  Card,
  Typography,
  Divider,
  Skeleton,
  Link,
  Statistic,
  Space, Spin,
} from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { IconCaretUp } from '@arco-design/web-react/icon';
import OverviewAreaLine from '@/components/Chart/overview-area-line';
import axios from 'axios';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import styles from './style/overview.module.less';
import IconCalendar from './assets/calendar.svg';
import IconComments from './assets/comments.svg';
import IconContent from './assets/content.svg';
import IconIncrease from './assets/increase.svg';
import { useRouter } from 'next/router';
import {APIGetHomeData, APIHome} from '@/api/api';
import {
  Axis,
  Chart,
  Coordinate,
  Interaction,
  Interval,
  Tooltip,
} from 'bizcharts';
const { Row, Col } = Grid;
type StatisticItemType = {
  icon?: ReactNode;
  title?: ReactNode;
  count?: ReactNode;
  loading?: boolean;
  unit?: ReactNode;
};

function StatisticItem(props: StatisticItemType) {
  const { icon, title, count, loading, unit } = props;
  return (
    <div className={styles.item}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <Skeleton loading={loading} text={{ rows: 2, width: 60 }} animation>
          <div className={styles.title}>{title}</div>
          <div className={styles.count}>
            {count}
            <span className={styles.unit}>{unit}</span>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}

type DataType = {
  allContents?: string;
  liveContents?: string;
  increaseComments?: string;
  growthRate?: string;
  chartData?: { count?: number; date?: string }[];
  down?: boolean;
};

const overView = [
  {
    name: 'USDT充值总额',
    value: 0,
    key:"totalChargeUsdt"
  },
  {
    name: 'AIS充值总额',
    value: 0,
    key:"totalChargeAis"
  },
  {
    name: 'USDT提现成功总额',
    value: 0,
    key:"totalWithDrawUsdt"
  },
  {
    name: 'AIS提现成功总额',
    value: 0,
    key:"totalWithDrawAis"
  },
  {
    name: 'USDT可提现总余额',
    value: 0,
    key:"totalWithDrawableUsdt"
  },
  {
    name: 'AIS可提现总余额',
    value: 0,
    key:"totalWithDrawableAis"
  },
  {
    name: 'USDT不可提现总余额',
    value: 0,
    key:"totalFreezeUsdt"
  },
  {
    name: 'AIS不可提现总余额',
    value: 0,
    key:"totalFreezeAis"
  },
  {
    name: '待销毁AIS总数',
    value: 0,
    key:"totalWaitBurnAis"
  },
  {
    name: '已销毁AIS总数',
    value: 0,
    key:"totalBurnAis"
  },
];

function Overview() {
  const [overViewData, setOverViewData] = useState(overView);
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  const getHome = () => {
    setLoading(true);
    APIGetHomeData({})
      .then((resp: any) => {
        if(resp.result){
          const data = overView.map(item => {
            return {
              ...item,
              value:resp.result[item.key]
            }
          })
          setOverViewData(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // fetchData();
    getHome();
  }, []);

  return (
    <Spin loading={loading}>
      <div className={'container'}>
        <Space wrap>
          {overViewData.map((item, index) => {
            return (
              <Card
                key={index}
                style={{ width: 300 }}
                title={item.name}
                hoverable
              >
                <Statistic value={item.value} groupSeparator precision={2} />
              </Card>
            );
          })}
        </Space>
      </div>
    </Spin>
  );
}

export default Overview;
