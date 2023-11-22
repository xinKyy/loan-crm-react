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
  Image,
  TableColumnProps,
  Modal,
  Input,
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
import qrPng from '../../../../src/imgs/qrcode.png';
import { APIGetCCOrderList, getHelpOrderList } from '@/api/api';
const Row = Grid.Row;
const Col = Grid.Col;

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];

function SearchTable() {
  const t = useLocale(locale);

  const tableCallback = async (record, type, e) => {
    console.log(record, type);
    if (!currentRecord || record.id !== currentRecord?.id) {
      setCurrentRecord(record);
    }
    if (e) e.stopPropagation();
    if (type === 'details') {
      setVisible(true);
    }
    if (type === 'accept') {
      openModal();
    }
    if (type === 'remarks') {
      setRemarkModalVisible(true);
    }
  };
  const [currentRecord, setCurrentRecord]: any = useState();
  const columns = useMemo(() => getColumns(t, tableCallback), [currentRecord]);

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
  const [modalVisible, setModalVisible] = useState(false);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    getCCOrder();
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

  const getCCOrder = () => {
    setLoading(true);
    APIGetCCOrderList({
      ...formParams,
    })
      .then((resp: any) => {
        if (resp.result) {
          setData(resp.result.records);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  const openModal = () => {
    setModalVisible(true);
  };

  const cancelModal = () => {
    setModalVisible(false);
  };

  return (
    <Card>
      <Title heading={6}>{t['menu.list.searchTable']}</Title>
      <SearchForm onSearch={handleSearch} />
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
        expandedRowRender={(record) => {
          return (
            <>
              <Col>
                <div className={styles.row}>
                  <div>
                    <span>本金：</span>1000
                  </div>
                  <div>
                    <span>充值CC：</span>1000
                  </div>
                  <div>
                    <span>收款地址：</span>1000
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <span>订单创建时间：</span>2023-11-1
                  </div>
                  <div>
                    <span>付款地址：</span>1000
                  </div>
                  <div>
                    <span>备注：</span>--
                  </div>
                </div>
                <Row></Row>
              </Col>
            </>
          );
        }}
        expandProps={{
          expandRowByClick: true,
          rowExpandable: (record) => true,
        }}
      />

      <Drawer
        width={800}
        title={null}
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
                    onClick={openModal}
                  >
                    审核
                  </Button>
                </Space>
                <Space>
                  <Button onClick={() => setRemarkModalVisible(true)}>
                    备注
                  </Button>
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
            <div className={styles.order_body_wrap}>
              <Tabs activeTab={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane key="1" title="订单信息">
                  <Col>
                    <div className={styles.title}>用户信息</div>
                    <div className={styles.row_item}>
                      <div>用户昵称：李哼好</div>
                      <div>用户ID：7777</div>
                      <div>绑定邮箱：163@qq.com</div>
                    </div>
                  </Col>
                  <Divider />
                  <Col>
                    <div className={styles.title}>订单信息</div>
                    <Row className={styles.row_wrap}>
                      <div className={styles.row_item}>
                        <div>本金：1000</div>
                        <div>充值CC：20.00</div>
                        <div>消耗CC：10.00</div>
                      </div>
                    </Row>
                    <Row className={styles.row_wrap}>
                      <div className={styles.row_item}>
                        <div>冻结周期：15天</div>
                        <div>预计收益：7777</div>
                        <div>匹配编号：111</div>
                      </div>
                    </Row>
                    <Row className={styles.row_wrap}>
                      <div className={styles.row_item}>
                        <div>匹配时间：2023-11-11</div>
                        <div>支付时间：2023-11-11</div>
                        <div>支付哈希值：0x111313123123123</div>
                      </div>
                    </Row>
                    <Row className={styles.row_wrap}>
                      <div style={{ display: 'flex' }}>
                        <div>充值凭证：</div>
                        <Space>
                          <Image
                            width={100}
                            src={
                              'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'
                            }
                          ></Image>
                        </Space>
                      </div>
                    </Row>
                  </Col>
                  <Divider />
                  <Col>
                    <div className={styles.title}>订单疑问</div>
                    <Col>
                      <div className={styles.row_wrap}>
                        疑问时间：2023-11-1 17：01：23
                      </div>
                      <div className={styles.row_wrap}>内容：测试</div>
                    </Col>
                  </Col>
                  <Divider />
                </Tabs.TabPane>
                <Tabs.TabPane key="2" title="订单记录">
                  <Table columns={orderColumns} data={orderData} />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </Skeleton>
      </Drawer>

      <Modal
        title="订单审核"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => cancelModal()}
        okText={'审核通过'}
        cancelText={'拒绝通过'}
        autoFocus={false}
        focusLock={true}
      >
        <p>是否已确认订单详情</p>
      </Modal>

      <Modal
        title="订单备注"
        visible={remarkModalVisible}
        onOk={() => setRemarkModalVisible(false)}
        onCancel={() => setRemarkModalVisible(false)}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Input.TextArea></Input.TextArea>
      </Modal>
    </Card>
  );
}

const orderColumns: TableColumnProps[] = [
  {
    title: '订单编号',
    dataIndex: 'name',
  },
  {
    title: '操作记录',
    dataIndex: 'salary',
  },
  {
    title: '操作时间',
    dataIndex: 'address',
  },
  {
    title: '操作角色',
    dataIndex: 'email',
  },
];

const orderData = [
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com',
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com',
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    salary: 22000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com',
  },
  {
    key: '4',
    name: 'Ed Hellen',
    salary: 17000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com',
  },
  {
    key: '5',
    name: 'William Smith',
    salary: 27000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com',
  },
];

export default SearchTable;
