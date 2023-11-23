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
  Checkbox,
  Statistic,
  Spin,
  Message,
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
import {
  APIEditLccOrderNote,
  APIMatchOrder, APIOrderActionLog,
  getHelpOrderList,
  getMatchOrderList,
} from '@/api/api';
const Row = Grid.Row;
const Col = Grid.Col;
const Countdown = Statistic.Countdown;

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = [
  '过期',
  '待支付',
  '取消订单',
  '匹配中',
  '已支付',
  '完成',
];

function SearchTable() {
  const t = useLocale(locale);

  const tableCallback = async (record, type, e) => {
    if (e) e.stopPropagation();
    if (!currentRecord || record.id !== currentRecord?.id) {
      setCurrentRecord(record);
    }

    if (type === 'details') {
      setVisible(true);
      getOrderActionLogs(record);
    }
    if (type === 'match') {
      openModal(record);
    }
    if (type === 'remarks') {
      setRemarkModalVisible(true);
    }
  };
  const [currentRecord, setCurrentRecord]: any = useState();
  const columns = useMemo(() => getColumns(t, tableCallback), [currentRecord]);

  const [data, setData] = useState([]);
  const [childData, setChildData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });

  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formParams, setFormParams] = useState({});
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [matchAmount, setMatchAmount] = useState(0);
  const [orderActionData, setOrderActionData] = useState([]);
  const [orderActionDataLoading, setOrderActionDataLoading] = useState(false);

  const getHelpOrder = () => {
    setLoading(true);
    getHelpOrderList({
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

  useEffect(() => {
    // fetchData();
    getHelpOrder();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

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

  const openModal = (record) => {
    setModalVisible(true);
    setModalLoading(true);
    setCurrentRecord(record);
    getMatchOrderList({
      orderType: record.orderType === 1 ? 0 : 1,
    })
      .then((resp: any) => {
        setChildData(resp.result.records);
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  const cancelModal = () => {
    setModalVisible(false);
  };

  const editLccNote = (record) => {
    setRemarkModalVisible(false);
    setPageLoading(true);
    APIEditLccOrderNote({
      orderId: record.id,
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

  const matchOrder = () => {
    setModalVisible(false);
    setPageLoading(true);
    APIMatchOrder({
      orderId: currentRecord.id,
      matchOrderIds: selectedRowKeys,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('匹配订单成功！');
          getHelpOrder();
        }
      })
      .finally(() => {
        setPageLoading(false);
      });
  };

  const getOrderActionLogs = (record) =>{
    setOrderActionDataLoading(true);
    APIOrderActionLog({
      orderId:record.id,
      type:1
    }).then((resp:any) => {
      setOrderActionData(resp.result);
    }).finally(()=>{
      setOrderActionDataLoading(false);
    });
  }

  return (
    <Spin style={{ width: '100%' }} loading={pageLoading}>
      <Card>
        <Title heading={6}>帮助订单列表</Title>
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
                      <span>本金：</span>
                      {record.orderType === 1
                        ? record.offerAmount
                        : record.amount}
                    </div>
                    <div>
                      <span>赠送LCC：</span>
                      {record.obtainLcc ?? '--'}
                    </div>
                    <div>
                      <span>消耗CC：</span>
                      {record.consumeLcc ?? '--'}
                    </div>
                    <div>
                      <span>收款地址：</span>
                      {record.toAddress ?? '--'}
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <span>订单创建时间：</span>
                      {record.createTime}
                    </div>
                    <div>
                      <span>匹配时间：</span>
                      {record.matchTime ?? '--'}
                    </div>
                    <div>
                      <span>备注：</span>{' '}
                      {record.id === currentRecord?.id
                        ? currentRecord?.note_confirm ?? record.note ?? '--'
                        : record.note ?? '--'}
                    </div>
                    <div>
                      <div>
                        <span>付款地址：</span>
                      </div>
                      {record.fromAddress ?? '--'}
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
                      {currentRecord?.orderType === 1
                        ? 'PH（提供帮助）'
                        : 'PH（获得帮助）'}
                    </div>
                    <div>订单编号：{currentRecord?.id}</div>
                  </div>
                </div>
                <div>
                  <Space>
                    {currentRecord?.status === 2 &&
                    currentRecord?.orderType !== 1 ? (
                      <Button
                        style={{ width: '100px', marginRight: '20px' }}
                        type="primary"
                        onClick={openModal}
                      >
                        匹配
                      </Button>
                    ) : null}
                  </Space>
                  <Space>
                    <Button
                      onClick={() => {
                        setVisible(false);
                        setRemarkModalVisible(true);
                      }}
                    >
                      备注
                    </Button>
                  </Space>
                </div>
              </div>
              <Row style={{ marginTop: '20px' }}>
                <Col span={8}>
                  <Space direction={'vertical'} size={'small'}>
                    <div>订单状态</div>
                    <Tag color={'#ff7d00'}>
                      {Status[currentRecord?.status + 1]}
                    </Tag>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction={'vertical'} size={'small'}>
                    订单金额
                    <div>
                      {currentRecord?.orderType === 1
                        ? currentRecord?.offerAmount
                        : currentRecord?.amount}
                    </div>
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
                        <div>用户昵称：{currentRecord?.userName}</div>
                        <div>用户ID：{currentRecord?.userId}</div>
                        <div>绑定邮箱：{'--'}</div>
                      </div>
                    </Col>
                    <Divider />
                    <Col>
                      <div className={styles.title}>订单信息</div>
                      <Row className={styles.row_wrap}>
                        <div className={styles.row_item}>
                          <div>
                            本金：
                            {currentRecord?.orderType === 1
                              ? currentRecord?.offerAmount
                              : currentRecord?.amount}
                          </div>
                          <div>赠送LCC：{currentRecord?.obtainLcc ?? '--'}</div>
                          <div>消耗CC：{currentRecord?.consumeLcc ?? '--'}</div>
                        </div>
                      </Row>
                      <Row className={styles.row_wrap}>
                        <div className={styles.row_item}>
                          <div>
                            冻结周期：{currentRecord?.freezeDay ?? '--'}天
                          </div>
                          <div>
                            预计收益：{currentRecord?.expectationAmount ?? '--'}
                          </div>
                          <div>
                            匹配编号：{currentRecord?.orderNumMatch ?? '--'}
                          </div>
                        </div>
                      </Row>
                      <Row className={styles.row_wrap}>
                        <div className={styles.row_item}>
                          <div>
                            匹配时间：{currentRecord?.matchTime ?? '--'}
                          </div>
                          <div>支付时间：{currentRecord?.payTime ?? '--'}</div>
                          <div>支付哈希值：{currentRecord?.hash ?? '--'}</div>
                        </div>
                      </Row>
                      <Row className={styles.row_wrap}>
                        <div style={{ display: 'flex' }}>
                          <div>支付凭证：</div>
                          <Space>
                            {currentRecord?.transferImage
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
                      <div className={styles.title}>订单备注</div>
                      <Col>
                        <div className={styles.row_wrap}>
                          疑问时间：{currentRecord?.questionTime ?? '--'}
                        </div>
                        <div className={styles.row_wrap}>
                          内容：{currentRecord?.question ?? '--'}
                        </div>
                      </Col>
                    </Col>
                    <Divider />
                  </Tabs.TabPane>
                  <Tabs.TabPane key="2" title="订单记录">
                    <Table loading={orderActionDataLoading} columns={orderColumns} data={orderActionData} />
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          </Skeleton>
        </Drawer>

        <Modal
          title={
            <span>
              可匹配提供帮助订单：
              <span
                style={{
                  color:
                    currentRecord?.amount - matchAmount === 0 ? 'green' : 'red',
                }}
              >
                当前还需匹配{currentRecord?.amount - matchAmount}金额
              </span>
            </span>
          }
          visible={modalVisible}
          wrapClassName={styles.table_modal_wrap}
          onOk={matchOrder}
          onCancel={() => cancelModal()}
          okText={'确定'}
          hideCancel={true}
          autoFocus={false}
          focusLock={true}
        >
          <Skeleton loading={modalLoading}>
            <Table
              rowKey="id"
              columns={mateColumns}
              data={childData}
              rowSelection={{
                type: 'checkbox',
                checkAll: false,
                selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                  let currentAmount = 0;
                  const selectedKeys = [];
                  selectedRows.forEach((item: any) => {
                    if (currentAmount + item.amount <= currentRecord.amount) {
                      currentAmount += item.amount;
                      selectedKeys.push(item.id);
                    }
                  });
                  setMatchAmount(currentAmount);
                  setSelectedRowKeys(selectedKeys);
                },
                onSelect: (selected, record, selectedRows) => {
                  console.log('onSelect:', selected, record, selectedRows);
                },
              }}
            />

            <div>
              <strong>差额补足账户</strong>
            </div>
            <div className={styles.row}>
              <div style={{ flex: 1 }}>
                <Checkbox>4</Checkbox>
              </div>
              <div style={{ flex: 2, margin: '0 20px' }}>
                <Input placeholder={'当前可用余额9999'}></Input>
              </div>
              <div>89999988888</div>
              <div>后台配置</div>
            </div>
          </Skeleton>
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
    render:(v)=>{
      return <div>{v.split("T")[0]} {v.split("T")[1].split("+")[0].split(".")[0]}</div>
    }
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
  },
];
const mateColumns: TableColumnProps[] = [
  {
    title: '订单编号',
    dataIndex: 'id',
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
  },
  {
    title: '账户来源',
    dataIndex: 'username',
    render: () => <div>用户</div>,
  },
  {
    title: '匹配剩余时间',
    dataIndex: 'deadLineTimeStamp',
    render: (v) => (
      <Countdown
        style={{ fontSize: '12px !important' }}
        styleValue={{ fontSize: '12px !important' }}
        value={v}
        format="D 天 H 时 m 分 s 秒"
        now={Date.now()}
      />
    ),
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
