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
  Message,
  Spin,
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
import {
  APIAcceptOrder,
  APIEditCCOrderNote,
  APIEditLccOrderNote,
  APIGetCCOrderList,
  APIOrderActionLog,
  getHelpOrderList,
} from '@/api/api';
const Row = Grid.Row;
const Col = Grid.Col;

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
const Status = ['待审核', '已完成', '已失效'];
function SearchTable() {
  const t = useLocale(locale);

  const tableCallback = async (record, type, e) => {
    if (!currentRecord || record.orderNo !== currentRecord?.orderNo) {
      setCurrentRecord(record);
    }
    if (e) e.stopPropagation();
    if (type === 'details') {
      setVisible(true);
      getOrderActionLogs(record);
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
    total: 0,
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

  const [orderActionData, setOrderActionData] = useState([]);
  const [orderActionDataLoading, setOrderActionDataLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

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
      page_size:pagination.pageSize,
      page_num:pagination.current,
    })
      .then((resp: any) => {
        if (resp.result) {
          setData(resp.result.records);
          setPatination({
            ...pagination,
            total:resp.result.total
          })
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
    setVisible(false);
  };

  const cancelModal = () => {
    setModalVisible(false);
  };

  const getOrderActionLogs = (record) => {
    setOrderActionDataLoading(true);
    APIOrderActionLog({
      orderId: record.orderNo,
      type: 0,
    })
      .then((resp: any) => {
        if(resp.result){
          setOrderActionData(resp.result);
        }
      })
      .finally(() => {
        setOrderActionDataLoading(false);
      });
  };

  const editLccNote = (record) => {
    setRemarkModalVisible(false);
    setPageLoading(true);
    APIEditCCOrderNote({
      orderId: record.orderNo,
      note: record.note_local,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('备注成功！');
          setCurrentRecord({
            ...record,
            note_confirm: record.note_local,
          });
        } else {
          Message.error('备注失败！');
        }
      })
      .finally(() => {
        setPageLoading(false);
      });
  };

  const accept = (flag) => {
    setModalVisible(false);
    setPageLoading(true);
    APIAcceptOrder({
      id: currentRecord.orderNo,
      uid: currentRecord.userId,
      flag: flag,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('操作成功！');
          getCCOrder();
        }
      })
      .finally(() => {
        setPageLoading(false);
      });
  };

  return (
    <Spin style={{ width: '100%' }} loading={pageLoading}>
      <Card>
        <Title heading={6}>{t['menu.list.searchTable']}</Title>
        <SearchForm onSearch={handleSearch} />
        <Table
          rowKey="orderNo"
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
                      <span>本金：</span>
                      {record.amount}
                    </div>
                    <div>
                      <span>充值CC：</span>
                      {record.amount}
                    </div>
                    <div>
                      <span>收款地址：</span>
                      {record.walletAddress}
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <span>订单创建时间：</span>
                      {record.createTime}
                    </div>
                    <div>
                      <span>付款地址：</span>
                      {record.transferAddress}
                    </div>
                    <div>
                      <span>备注：</span>{' '}
                      {record.orderNo === currentRecord?.orderNo
                        ? currentRecord?.note_confirm ?? record.note ?? '--'
                        : record.note ?? '--'}
                    </div>
                  </div>
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
                      充值基金订单
                    </div>
                    <div>订单编号：{currentRecord?.orderNo}</div>
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
                    <Tag color={'#ff7d00'}>{Status[currentRecord?.status]}</Tag>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction={'vertical'} size={'small'}>
                    订单金额
                    <div>{currentRecord?.amount}</div>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction={'vertical'} size={'small'}>
                    创建时间
                    <div>{currentRecord?.createTime}</div>
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
                        <div>用户昵称：{currentRecord?.userName ?? '--'}</div>
                        <div>用户ID：{currentRecord?.userId ?? '--'}</div>
                        <div>绑定邮箱：{currentRecord?.email ?? '--'}</div>
                      </div>
                    </Col>
                    <Divider />
                    <Col>
                      <div className={styles.title}>订单信息</div>
                      <Row className={styles.row_wrap}>
                        <div className={styles.row_item}>
                          <div>本金：{currentRecord?.amount ?? '--'}</div>
                          <div>充值CC：{currentRecord?.amount ?? '--'}</div>
                          <div>
                            充值哈希值：{currentRecord?.transferHash ?? '--'}
                          </div>
                        </div>
                      </Row>
                      <Row className={styles.row_wrap}>
                        <div className={styles.row_item}>
                          <div>订单状态：{Status[currentRecord?.status]}</div>
                          <div>订单编号：{currentRecord?.orderNo}</div>
                          <div>创建时间：{currentRecord?.createTime}</div>
                        </div>
                      </Row>
                      <Row className={styles.row_wrap}>
                        <div style={{ display: 'flex' }}>
                          <div>充值凭证：</div>
                          <Space>
                            {currentRecord?.chargeImage
                              ?.split('|')
                              .map((item) => {
                                return (
                                  <Image
                                    key={item}
                                    width={100}
                                    height={100}
                                    src={item}
                                  ></Image>
                                );
                              })}
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
                    <Table
                      loading={orderActionDataLoading}
                      columns={orderColumns}
                      data={orderActionData}
                    />
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          </Skeleton>
        </Drawer>

        <Modal
          title="订单审核"
          visible={modalVisible}
          onOk={() => accept(1)}
          onCancel={() => setModalVisible(false)}
          okText={'审核通过'}
          hideCancel
          autoFocus={false}
          focusLock={true}
          footer={<>
            <Button onClick={()=>accept(2)} type={"default"}>拒绝通过</Button>
            <Button onClick={()=>accept(1)} type={"primary"}>审核通过</Button>
          </>}
        >
          <p>是否已确认订单详情</p>
        </Modal>

        <Modal
          title="订单备注"
          visible={remarkModalVisible}
          onOk={() => editLccNote(currentRecord)}
          onCancel={() => setRemarkModalVisible(false)}
          okText={'确定'}
          hideCancel={true}
          autoFocus={false}
          focusLock={true}
        >
          <Input.TextArea
            value={currentRecord?.note_local}
            onChange={(v) =>
              setCurrentRecord({
                ...currentRecord,
                note_local: v,
              })
            }
          ></Input.TextArea>
        </Modal>
      </Card>
    </Spin>
  );
}

const orderColumns: TableColumnProps[] = [
  {
    title: '订单编号',
    dataIndex: 'orderId',
  },
  {
    title: '操作记录',
    dataIndex: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    render: (v) => {
      return (
        <div>
          {v.split('T')[0]} {v.split('T')[1].split('+')[0].split('.')[0]}
        </div>
      );
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
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
