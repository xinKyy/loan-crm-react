import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Grid,
  Radio,
  Space,
  Dropdown,
  Menu,
  PaginationProps,
  Table,
  Modal,
  Message,
  Card,
} from '@arco-design/web-react';
import {
  IconDown,
  IconRefresh,
  IconSearch,
  IconInfoCircle,
} from '@arco-design/web-react/icon';
import styles from '../../index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import {
  APIConfirmWithdraw,
  APIGetChargeRecord,
  APIGetLoanOrderCancel,
  APIGetLoanOrderClose,
  APIGetLoanOrderList,
} from '@/api/api';
import { withDrawUSDT } from '@/utils/web3Util';
import ModalAlert from '@/components/ModalAlert';
import { useRouter } from 'next/router';
const { RangePicker } = DatePicker;
const { useForm } = Form;
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;

const loanStatus = {
  SUBMIT_LOAN: '提交借款申请',
  TO_MAN_REVIEWED: '待人工审核',
  REVIEWED_PASSED: '审核通过',
  REVIEWED_RETUR: '审核退回',
  REVIEWED_REJECT: '审核拒绝',
  PUSHING_SINGLE: '推单中',
  PUSH_SINGLE_FAIL: '推单失败',
  LOAN_SUCCESS: '放款成功',
  LOAN_FAIL: '放款失败',
  NO_REPAYMENT: '未还款',
  OVERDUE: '逾期',
  HAS_BEEN_CLEARED: '已结清',
};

const showState = [
  'TO_MAN_REVIEWED',
  'REVIEWED_PASSED',
  'REVIEWED_RETUR',
  'REVIEWED_REJECT',
];

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();
  const handleSubmit = () => {
    const values = form.getFieldsValue();
    for (const key in values) {
      if (values[key] == '') {
        delete values[key];
      }
    }
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  function onSelect(dateString, date) {
    console.log('onSelect', dateString, date);
  }

  function onChange(dateString, date) {
    console.log('onChange: ', dateString, date);
  }

  function onOk(dateString, date) {
    console.log('onOk: ', dateString, date);
  }

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 15 }}
      >
        <div style={{ display: 'flex' }}>
          <Form.Item
            labelCol={{ span: 2 }}
            label={'工单状态：'}
            field={'state'}
          >
            <RadioGroup type="button" name="lang">
              {/* <Radio value={0}>待自动审核</Radio>*/}
              <Radio value={'TO_MAN_REVIEWED'}>待人工审核</Radio>
              <Radio value={2}>取消</Radio>
              <Radio value={'REVIEWED_RETUR'}>审核退回</Radio>
              <Radio value={'REVIEWED_REJECT'}>审核拒绝</Radio>
              <Radio value={'REVIEWED_PASSED'}>审核通过</Radio>
              <Radio value={7}>关闭</Radio>
            </RadioGroup>
          </Form.Item>
        </div>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label={'工单ID:'} field="orderNo">
              <Input placeholder={'请输入工单ID'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'用户姓名:'} field="name">
              <Input placeholder={'请输入用户姓名'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'KTP账号:'} field="idCardNo">
              <Input placeholder={'请输入KTP账号'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'借款时间'} field={'loanDate'}>
              <RangePicker
                style={{ width: 400, margin: '0 0 0 0' }}
                showTime={{
                  defaultValue: ['00:00', '00:00'],
                  format: 'HH:mm',
                }}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={onChange}
                onSelect={onSelect}
                onOk={onOk}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          搜索
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

const getColumns = (callback) => {
  return [
    {
      title: '工单ID',
      dataIndex: 'orderNo',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '用户类型',
      dataIndex: 'firstLoan',
      render: (_) => <div>{_ === 1 ? '首次借款' : '多次借款'}</div>,
    },
    {
      title: '借款类型',
      dataIndex: 'loanType',
    },
    {
      title: '工单状态',
      dataIndex: 'state',
      render: (_) => <div>{loanStatus[_]}</div>,
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
    },
    {
      title: 'KTP身份证号',
      dataIndex: 'idCardNo',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '借款本金',
      dataIndex: 'loanAmount',
    },
    {
      title: '借款期限',
      dataIndex: 'period',
      render: (_) => <div>{_}天</div>,
    },
    {
      title: '借款时间',
      dataIndex: 'loanDate',
    },
    {
      title: '审核时间',
      dataIndex: 'approvedDate',
    },
    {
      title: '操作',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <>
            {showState.includes(record.state) && (
              <Space>
                {record.state === 'TO_MAN_REVIEWED' ? (
                  <Button
                    type="primary"
                    size="small"
                    onClick={(e) => callback(record, '审核')}
                  >
                    审核
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    onClick={(e) => callback(record, '查看')}
                  >
                    查看
                  </Button>
                )}
                {
                  // <Button type="default" status={"danger"} size="small" onClick={(e) => callback(record, "取消")}>
                  //   取消
                  // </Button>
                  // <Button type="dashed" status={"warning"} size="small" onClick={(e) => callback(record, "关闭")}>
                  // 关闭
                  // </Button>
                }
              </Space>
            )}
          </>
        );
      },
    },
  ];
};

const WorkOrderCheck = () => {
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    total: 0,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [formParams, setFormParams] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [currentConfirmRecord, setCurrentConfirmRecord]: any = useState();
  const router = useRouter();
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = (record, currentAction) => {
    setCurrentConfirmRecord({ ...record });
    if (currentAction === '取消') {
      setQuestionVisible(true);
    }
    if (currentAction === '关闭') {
      setExitVisible(true);
    }
    if (currentAction === '审核') {
      router.push(
        `/work-order-management/work-order-check/order-detail-view?orderNo=${record.orderNo}&userId=${record.userId}`
      );
    }
  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const columns = useMemo(() => getColumns(callBack), []);

  useEffect(() => {
    getData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  const getData = (loading?) => {
    if (!loading) setLoading(true);
    APIGetLoanOrderList({
      ...formParams,
      size: pagination.pageSize,
      number: pagination.current,
    })
      .then((resp: any) => {
        if (resp.data) {
          setData(resp.data.content);
          setPatination({
            ...pagination,
            total: resp.data.totalElements,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmQuestion = (type) => {
    setQuestionVisible(false);
    setExitVisible(false);
    setLoading(true);
    if (type === 1) {
      APIGetLoanOrderCancel({
        orderNo: currentConfirmRecord?.orderNo,
      })
        .then((resp: any) => {
          if (resp.data) {
            Message.success('已取消该工单');
            getData();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      APIGetLoanOrderClose({
        orderNo: currentConfirmRecord?.orderNo,
      })
        .then((resp: any) => {
          if (resp.data) {
            Message.success('已关闭该工单');
            getData();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Card>
      <div>
        <SearchForm onSearch={handleSearch}></SearchForm>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />

        <ModalAlert
          title={'取消工单'}
          body={
            <div>
              <IconInfoCircle style={{ color: '#ff0000', fontSize: '16px' }} />
              此操作会取消工单号【{currentConfirmRecord?.orderNo}】,是否继续？
            </div>
          }
          visible={questionVisible}
          onCancel={() => setQuestionVisible(false)}
          refuseFun={() => setQuestionVisible(false)}
          confirmFun={() => confirmQuestion(1)}
        />

        <ModalAlert
          title={'关闭工单'}
          body={
            <div>
              <IconInfoCircle style={{ color: '#ff0000', fontSize: '16px' }} />
              此操作会关闭工单号【{currentConfirmRecord?.orderNo}】,是否继续？
            </div>
          }
          visible={exitVisible}
          onCancel={() => setExitVisible(false)}
          refuseFun={() => setExitVisible(false)}
          confirmFun={() => confirmQuestion(2)}
        />
      </div>
    </Card>
  );
};

export default WorkOrderCheck;
