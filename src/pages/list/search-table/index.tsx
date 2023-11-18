import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Drawer,
  Skeleton,
  Grid,
  Tag,
  Tabs,
  Divider,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';
const Row = Grid.Row;
const Col = Grid.Col;

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchTable() {
  const t = useLocale(locale);

  const tableCallback = async (record, type) => {
    console.log(record, type);
    if (type === 'details') {
      setVisible(true);
    }
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});

  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    axios
      .get('/api/list', {
        params: {
          page: current,
          pageSize,
          ...formParams,
        },
      })
      .then((res) => {
        setData(res.data.list);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.data.total,
        });
        setLoading(false);
      });
  }

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  return (
    <Card>
      <Title heading={6}>{t['menu.list.searchTable']}</Title>
      <SearchForm onSearch={handleSearch} />
      <PermissionWrapper
        requiredPermissions={[
          { resource: 'menu.list.searchTable', actions: ['write'] },
        ]}
      >
        <div className={styles['button-group']}>
          <Space>
            <Button type="primary" icon={<IconPlus />}>
              {t['searchTable.operations.add']}
            </Button>
            <Button>{t['searchTable.operations.upload']}</Button>
          </Space>
          <Space>
            <Button icon={<IconDownload />}>
              {t['searchTable.operation.download']}
            </Button>
          </Space>
        </div>
      </PermissionWrapper>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />

      <Drawer
        width={600}
        title={<span>Basic Information </span>}
        visible={visible}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <Skeleton
          loading={false}
          animation
          text={{
            rows: 15,
            width: ['100%', 600, 400, 300],
          }}
        >
          <div className={styles.drawer_wrap}>
            <div className={styles.order_header}>
              <div style={{ display: 'flex' }}>
                <div className={styles.order_header_icon}></div>
                <div style={{ margin: '15px' }}>
                  <div style={{ fontWeight: 600, fontSize: '20px' }}>
                    得到订单
                  </div>
                  <div>订单编号：88888888</div>
                </div>
              </div>
              <div>
                <Space>
                  <Button
                    style={{ width: '100px', marginRight: '20px' }}
                    type="primary"
                  >
                    匹配
                  </Button>
                </Space>
                <Space>
                  <Button>备注</Button>
                </Space>
              </div>
            </div>
            <Row style={{ marginTop: '20px' }}>
              <Col span={8}>
                <Space direction={'vertical'} size={'small'}>
                  <div>订单状态</div>
                  <Tag color={'#ff7d00'}>匹配中</Tag>
                </Space>
              </Col>
              <Col span={8}>
                <Space direction={'vertical'} size={'small'}>
                  订单金额
                  <div>1000.0</div>
                </Space>
              </Col>
              <Col span={8}>
                <Space direction={'vertical'} size={'small'}>
                  创建时间
                  <div>2023-01-1</div>
                </Space>
              </Col>
            </Row>
            <Divider />
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              <Tabs.TabPane key="1" title="订单信息"></Tabs.TabPane>
              <Tabs.TabPane key="2" title="订单记录"></Tabs.TabPane>
            </Tabs>
          </div>
        </Skeleton>
      </Drawer>
    </Card>
  );
}

export default SearchTable;
