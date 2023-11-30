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
  InputNumber,
  Descriptions,
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
  APIConfirmQuestion,
  APIEditLccOrderNote,
  APIMatchOrder,
  APIOrderActionLog,
  getHelpOrderList,
  getMatchOrderList,
} from '@/api/api';
import { splitWalletAddress } from '@/utils/dateUtil';
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
  '收益中',
  '待审核',
];

function SearchTable() {
  const t = useLocale(locale);

  const tableCallback = async (record, type, e) => {
    if (e) e.stopPropagation();
    setDrawerInfo(record);
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
    total: 0,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });

  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formParams, setFormParams] = useState({});
  const [visible, setVisible] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [matchAmount, setMatchAmount] = useState(0);
  const [inputNumber, setInputNumber]: any = useState();
  const [checkedAdmin, setCheckedAdmin] = useState(false);
  const [orderActionData, setOrderActionData] = useState([]);
  const [orderActionDataLoading, setOrderActionDataLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    userInfo: [],
    orderInfo: [],
    orderQuestion: [],
    record: {
      status: 0,
    },
  });
  const getHelpOrder = () => {
    setLoading(true);
    getHelpOrderList({
      ...formParams,
      page_size: pagination.pageSize,
      page_num: pagination.current,
    })
      .then((resp: any) => {
        if (resp.result) {
          setData(resp.result.records);
          setPatination({
            ...pagination,
            total: resp.result.total,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setDrawerInfo = (record) => {
    const map = {
      userInfo: [
        {
          label: '用户昵称',
          value: record?.userName ?? '--',
        },
        {
          label: '用户ID',
          value: record?.userId ?? '--',
        },
        {
          label: '绑定邮箱',
          value: record?.email ?? '--',
        },
      ],
      orderInfo: [
        {
          label: '本金',
          value: record?.orderType === 1 ? record?.offerAmount : record?.amount,
        },
        {
          label: '赠送LCC',
          value: record?.obtainLcc ?? '--',
        },
        {
          label: '消耗CC',
          value: record?.consumeLcc ?? '--',
        },
        {
          label: '冻结周期',
          value: `${record?.freezeDay ?? '--'}天`,
        },
        {
          label: '预计收益',
          value: record?.expectationAmount ?? '--',
        },
        {
          label: '匹配编号',
          value: record?.orderNumMatch ?? '--',
        },

        {
          label: '匹配时间',
          value: record?.matchTime ?? '--',
        },
        {
          label: '支付时间',
          value: record?.payTime ?? '--',
        },
        {
          label: '支付哈希值',
          value: record?.hash ? (
            <a
              target="_blank"
              href={`https://testnet.bscscan.com/tx/${record?.hash}`}
              rel="noreferrer"
            >
              {splitWalletAddress(record?.hash)}
            </a>
          ) : (
            '--'
          ),
        },
      ],
      orderQuestion: [],
      record: record,
    };
    setPageInfo({
      ...map,
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
        if (resp.result) {
          setChildData(resp.result.records);
        }
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  const cancelModal = () => {
    setSelectedRowKeys([]);
    setModalVisible(false);
    setMatchAmount(0);
    setInputNumber(null);
    setCheckedAdmin(false);
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
      repairAdminAmount: checkedAdmin ? inputNumber : 0,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('匹配订单成功！');
          getHelpOrder();
        }
      })
      .finally(() => {
        setPageLoading(false);
        setCheckedAdmin(false);
        setInputNumber(null);
        setMatchAmount(0);
        setSelectedRowKeys([]);
      });
  };

  const getOrderActionLogs = (record) => {
    setOrderActionDataLoading(true);
    APIOrderActionLog({
      orderId: record.id,
      type: 1,
    })
      .then((resp: any) => {
        if (resp.result) {
          setOrderActionData(resp.result);
        }
      })
      .finally(() => {
        setOrderActionDataLoading(false);
      });
  };

  const confirmQuestion = (type) => {
    setQuestionVisible(false);
    setLoading(true);
    APIConfirmQuestion({
      orderId: currentRecord?.id,
      flag: type,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('审核成功！');
          getHelpOrder();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
                      <a
                        target="_blank"
                        href={`https://testnet.bscscan.com/tx/${record.toAddress}`}
                        rel="noreferrer"
                      >
                        {splitWalletAddress(record.toAddress)}
                      </a>
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
                        <a
                          target="_blank"
                          href={`https://testnet.bscscan.com/tx/${record.fromAddress}`}
                          rel="noreferrer"
                        >
                          {splitWalletAddress(record.fromAddress)}
                        </a>
                      </div>
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
                    <Descriptions
                      colon=" :"
                      layout="inline-horizontal"
                      title="用户信息"
                      data={pageInfo.userInfo}
                    />
                    <Divider />
                    <Descriptions
                      colon=" :"
                      layout="inline-horizontal"
                      title="订单信息"
                      data={pageInfo.orderInfo}
                    />
                    <Divider />
                    <Col>
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
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div className={styles.title}>订单疑问</div>
                        {currentRecord?.question ? (
                          <Button
                            onClick={() => setQuestionVisible(true)}
                            type={'primary'}
                          >
                            确认疑问
                          </Button>
                        ) : null}
                      </div>
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
          title={
            <span>
              可匹配提供帮助订单：
              <span
                style={{
                  color:
                    currentRecord?.amount -
                      (matchAmount ?? 0) -
                      (checkedAdmin && inputNumber ? inputNumber : 0) ===
                    0
                      ? 'green'
                      : 'red',
                }}
              >
                {currentRecord?.amount -
                  (matchAmount ?? 0) -
                  (checkedAdmin && inputNumber ? inputNumber : 0) ===
                0 ? (
                  <span>匹配成功！</span>
                ) : (
                  <span>
                    当前还需匹配
                    {currentRecord?.amount -
                      (matchAmount ?? 0) -
                      (checkedAdmin && inputNumber ? inputNumber : 0)}
                    金额
                  </span>
                )}
              </span>
            </span>
          }
          visible={modalVisible}
          wrapClassName={styles.table_modal_wrap}
          onOk={matchOrder}
          onCancel={() => cancelModal()}
          okText={'确定'}
          okButtonProps={{
            disabled:
              currentRecord?.amount -
                (matchAmount ?? 0) -
                (checkedAdmin && inputNumber ? inputNumber : 0) !==
              0,
          }}
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
                  console.log('');
                },
              }}
            />

            <div>
              <strong>差额补足账户</strong>
            </div>
            <div className={styles.row}>
              <div style={{ flex: 1 }}>
                <Checkbox
                  onClick={() => setCheckedAdmin(!checkedAdmin)}
                  checked={checkedAdmin}
                >
                  4
                </Checkbox>
              </div>
              <div style={{ flex: 2, margin: '0 20px' }}>
                <InputNumber
                  placeholder="可用余额99999"
                  min={0}
                  value={inputNumber}
                  style={{ width: 160, margin: '10px 24px 10px 0' }}
                  onChange={(v) => {
                    setInputNumber(v);
                  }}
                />
              </div>
              <div>99999999</div>
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

        <Modal
          title="确认疑问"
          visible={questionVisible}
          onCancel={() => setQuestionVisible(false)}
          hideCancel
          autoFocus={false}
          focusLock={true}
          footer={
            <>
              <Button onClick={() => confirmQuestion(-1)} type={'default'}>
                拒绝通过
              </Button>
              <Button onClick={() => confirmQuestion(1)} type={'primary'}>
                审核通过
              </Button>
            </>
          }
        >
          <p>是否已确认订单详情</p>
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
