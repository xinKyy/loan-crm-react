import React, { useState, useEffect, ReactNode } from 'react';
import {
  Grid,
  Card,
  Typography,
  Divider,
  Skeleton,
  Link,
  Statistic,
  Space,
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
import { APIHome } from '@/api/api';
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
  },
  {
    name: 'AIS充值总额',
    value: 0,
  },
  {
    name: 'USDT提现成功总额',
    value: 0,
  },
  {
    name: 'AIS提现成功总额',
    value: 0,
  },
  {
    name: 'USDT可提现总余额',
    value: 0,
  },
  {
    name: 'AIS可提现总余额',
    value: 0,
  },
  {
    name: 'USDT不可提现总余额',
    value: 0,
  },
  {
    name: 'AIS不可提现总余额',
    value: 0,
  },
  {
    name: '待销毁AIS总数',
    value: 0,
  },
  {
    name: '已销毁AIS总数',
    value: 0,
  },
];

function Overview() {
  const [data, setData] = useState<DataType>({});
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const t = useLocale(locale);

  const userInfo = useSelector((state: any) => state.userInfo || {});

  const [homeData, setHomeData]: any = useState();
  const [orderData, setOrderData]: any = useState([]);
  const [obtainOrderData, setObtainOrderData]: any = useState([]);
  const [obtainChartData, setObtainChartData] = useState([]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get('/api/workplace/overview-content')
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getHome = () => {
    setLoading(true);
    APIHome({})
      .then((resp: any) => {
        setHomeData(resp.result);
        const data: DataType = {
          chartData: [],
        };
        if (resp?.result?.offer) {
          resp.result.offer.forEach((item) => {
            data.chartData.push({
              count: item.amount,
              date: item.date,
            });
          });
          setData(data);
        }

        if (resp?.result?.obtain) {
          const tempData = [];
          resp.result.obtain.forEach((item) => {
            tempData.push({
              count: item.amount,
              date: item.date,
            });
          });
          setObtainChartData(tempData);
        }

        setOrderData([
          {
            type: '今日提供订单金额',
            value: resp?.result?.toDayOffAmount,
          },
          {
            type: '昨日提供订单金额',
            value: resp?.result?.yesToDayOffAmount,
          },
        ]);

        setObtainOrderData([
          {
            type: '今日得到订单金额',
            value: resp?.result?.toDayObtainAmount,
          },
          {
            type: '昨日得到订单金额',
            value: resp?.result?.yesToDayObtainAmount,
          },
        ]);
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
    <div className={'container'}>
      <Space wrap>
        {overView.map((item, index) => {
          return (
            <Card
              key={index}
              style={{ width: 300 }}
              title={item.name}
              extra={'今日数据'}
              hoverable
            >
              <Statistic value={item.value} groupSeparator precision={2} />
            </Card>
          );
        })}
      </Space>
    </div>
  );
}

export default Overview;
