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
  Tabs,
  Descriptions,
  PageHeader,
  Divider,
  Spin,
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
  APIGetLoanOrderList,
  APIOrderQuery,
} from '@/api/api';
import { withDrawUSDT } from '@/utils/web3Util';
import ModalAlert from '@/components/ModalAlert';
const { RangePicker } = DatePicker;
const { useForm } = Form;
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label={'工单ID:'} field="orderNo">
              <Input placeholder={'请输入工单ID'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'客户手机号:'} field="phone">
              <Input placeholder={'请输入客户手机号'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'KTP账号:'} field="ktpNo">
              <Input placeholder={'请输入KTP账号'} allowClear />
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
const getColumns = () => {
  return [
    {
      title: '工单ID',
      dataIndex: 'orderNo',
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
      title: '借款本金',
      dataIndex: 'contractAmount',
    },
    {
      title: '借款期限',
      dataIndex: 'loanDay',
    },
    {
      title: '借款时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '计划还款日',
      dataIndex: 'repaymentDate',
    },
    {
      title: '实还金额',
      dataIndex: 'realRepaymentAmount',
    },
    {
      title: '还款状态',
      dataIndex: 'repaymentCodeState',
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDay',
    },
  ];
};

const OrderDetailView = () => {
  const [baseData, setBaseData] = useState([]);
  const [base2Data, setBase2Data] = useState([]);
  const [base3Data, setBase3Data] = useState([]);

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
  const columns = useMemo(() => getColumns(), []);

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    getData(params);
  }

  const getData = (params, loading?) => {
    if (!loading) setLoading(true);
    APIOrderQuery({
      ...params,
    })
      .then((resp: any) => {
        if (resp.data) {
          const orderDetailAdminVo = resp.data.orderDetailAdminVo;
          const card = resp.data.card;

          if (orderDetailAdminVo) {
            setBaseData([
              {
                label: '客户姓名',
                value: orderDetailAdminVo.name,
              },
              {
                label: '性别',
                value: orderDetailAdminVo.sex,
              },
              {
                label: '手机号',
                value: orderDetailAdminVo.phone,
              },
              {
                label: 'Email',
                value: orderDetailAdminVo.email,
              },
              {
                label: '开发银行',
                value: orderDetailAdminVo.bankName,
              },
              {
                label: '银行账户',
                value: orderDetailAdminVo.bankNo,
              },
              {
                label: '注册时间',
                value: orderDetailAdminVo.registerTime,
              },
              // {
              //   label:"注册渠道",
              //   value:orderDetailAdminVo.registerChannel
              // },
            ]);
          }

          if (card) {
            setBase2Data([
              {
                label: '总额度',
                value: card.creditQuota,
              },
              {
                label: '已用额度',
                value: card.usedQuota,
              },
              {
                label: '可用额度',
                value: card.availableQuota,
              },
              {
                label: 'PDL额度',
                value: card.itmCreditQuota,
              },
              {
                label: '已用PDL额度',
                value: card.itmUsedQuota,
              },
              {
                label: '可用PDL额度',
                value: card.itmAvailableQuota,
              },
              {
                label: '分期额度',
                value: card.upQuota,
              },
              {
                label: '已用分期额度',
                value: card.upQuota,
              },
              {
                label: '可用分期额度',
                value: card.upQuota,
              },
            ]);
          }

          setData(resp.data.repaymentPlans.content);
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

  return (
    <Spin style={{ width: '100%' }} loading={loading}>
      <Card style={{ minHeight: '100vh' }}>
        <SearchForm onSearch={handleSearch}></SearchForm>
        {baseData.length > 0 && (
          <>
            <Descriptions border data={baseData} />
            <div style={{ height: '20px' }}></div>
            <Descriptions border data={base2Data} />
            <Divider />
            <Table loading={loading} data={data} columns={columns} />
          </>
        )}
      </Card>
    </Spin>
  );
};

export default OrderDetailView;
