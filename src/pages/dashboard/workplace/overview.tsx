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
    <>
      <Row>
        <Card style={{ width: '100%' }}>
          <Row gutter={24}>
            <Space>
              <Card
                style={{ width: 300 }}
                title="已赠送LCC数量"
              >
                <Statistic
                  extra={`今日赠送 ${homeData?.todayAllLcc}`}
                  value={homeData?.allLcc}
                  groupSeparator
                  precision={2}
                />
              </Card>
              <Card
                style={{ width: 300 }}
                title="已充值CC总量"
              >
                <Statistic
                  extra={`今日充值 ${homeData?.todayAllChargeCc}`}
                  value={homeData?.allChargeCc}
                  groupSeparator
                  precision={2}
                />
              </Card>
              <Card
                style={{ width: 300 }}
                title="已提供帮助总量"
              >
                <Statistic
                  extra={`今日提供帮助 ${homeData?.toDayOfferOrderSize}`}
                  value={homeData?.allOffer}
                  groupSeparator
                  precision={2}
                />
              </Card>
            </Space>
          </Row>
          <Divider />
          <Row style={{ marginTop: '20px' }} gutter={24}>
            <Col flex={1}>
              <div
                onClick={() => {
                  router.push('/user/user-table');
                }}
              >
                <StatisticItem
                  icon={<IconCalendar />}
                  title={'用户管理'}
                  count={"--"}
                  loading={loading}
                  unit={t['workplace.pecs']}
                />
              </div>
            </Col>
            <Divider type="vertical" className={styles.divider} />
            <Col flex={1}>
              <div
                onClick={() => {
                  router.push('/list/help-table');
                }}
              >
                <StatisticItem
                  icon={<IconContent />}
                  title={'订单管理'}
                  count={"--"}
                  loading={loading}
                  unit={t['workplace.pecs']}
                />
              </div>
            </Col>
            <Divider type="vertical" className={styles.divider} />
            <Col flex={1}>
              <div
                onClick={() => {
                  router.push('/distribution/distribution-table');
                }}
              >
                <StatisticItem
                  icon={<IconComments />}
                  title={'分销管理'}
                  count={"--"}
                  loading={loading}
                  unit={t['workplace.pecs']}
                />
              </div>
            </Col>
            <Divider type="vertical" className={styles.divider} />
            <Col flex={1}>
              <div
                onClick={() => {
                  router.push('/post/post-table');
                }}
              >
                <StatisticItem
                  icon={<IconIncrease />}
                  title={'文章管理'}
                  count={"--"}
                  loading={loading}
                  unit={t['workplace.pecs']}
                />
              </div>
            </Col>
          </Row>
          <Divider />
          <Card>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: '2' }}>
                <div className={styles.ctw}>
                  <Statistic
                    title="当日提供订单金额"
                    value={homeData?.toDayOffAmount ?? '--'}
                    groupSeparator
                  />
                </div>
                <OverviewAreaLine data={data.chartData} loading={loading} />
              </div>
              <Card style={{ width: 360, flex: '1' }} title="数据统计">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Statistic
                    title="当日订单数"
                    value={homeData?.toDayOfferOrderSize ?? '--'}
                    groupSeparator
                  />
                  <Statistic
                    title="当日支付人数"
                    value={homeData?.toDayOfferPeopleSize ?? '--'}
                    groupSeparator
                  />
                </div>
                <Chart data={orderData} height={200} autoFit>
                  <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
                  <Axis visible={false} />
                  <Tooltip showTitle={false} />
                  <Interval
                    adjust="stack"
                    position="value"
                    color="type"
                    shape="sliceShape"
                  />
                  <Interaction type="element-single-selected" />
                </Chart>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Statistic
                    title="当月订单数"
                    value={homeData?.monthDayOfferOrderSize ?? '--'}
                    groupSeparator
                  />
                  <Statistic
                    title="当月支付人数"
                    value={homeData?.monthDayOfferPeopleSize ?? '--'}
                    groupSeparator
                  />
                </div>
              </Card>
            </div>
            <Divider />
            <div style={{ display: 'flex' }}>
              <div style={{ flex: '2' }}>
                <div className={styles.ctw}>
                  <Statistic
                    title="当日得到订单金额"
                    value={homeData?.toDayObtainAmount ?? '--'}
                    groupSeparator
                  />
                </div>
                <OverviewAreaLine data={obtainChartData} loading={loading} />
              </div>
              <Card style={{ width: 360, flex: '1' }} title="数据统计">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Statistic
                    title="当日订单数"
                    value={homeData?.toDayObtainOrderSize ?? '--'}
                    groupSeparator
                  />
                  <Statistic
                    title="当日得到人数"
                    value={homeData?.toDayObtainPeopleSize ?? '--'}
                    groupSeparator
                  />
                </div>
                <Chart data={obtainOrderData} height={200} autoFit>
                  <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
                  <Axis visible={false} />
                  <Tooltip showTitle={false} />
                  <Interval
                    adjust="stack"
                    position="value"
                    color="type"
                    shape="sliceShape"
                  />
                  <Interaction type="element-single-selected" />
                </Chart>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Statistic
                    title="当月订单数"
                    value={homeData?.monthDayObtainOrderSize ?? '--'}
                    groupSeparator
                  />
                  <Statistic
                    title="当月得到人数"
                    value={homeData?.monthDayObtainPeopleSize ?? '--'}
                    groupSeparator
                  />
                </div>
              </Card>
            </div>
          </Card>
        </Card>
      </Row>
    </>
  );
}

export default Overview;
