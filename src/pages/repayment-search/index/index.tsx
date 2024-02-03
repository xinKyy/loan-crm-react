import React, {useContext, useEffect, useMemo, useState} from 'react';
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
  Message, Card, InputNumber,
} from '@arco-design/web-react';
import { IconDown, IconRefresh, IconSearch, IconInfoCircle } from '@arco-design/web-react/icon';
import styles from '../../index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import {
  APIClearOrder,
  APIConfirmWithdraw,
  APIGetChargeRecord, APIGetLoanOrderList, APIGetRepaymentPlanList,
} from '@/api/api';
import { withDrawUSDT } from '@/utils/web3Util';
import ModalAlert from '@/components/ModalAlert';
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
function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();
  const [orderType, setOrderType] = useState(2);

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    if (values.dateStartAndEnd) {
      values.startRepaymentTime = values.dateStartAndEnd[0];
      values.endRepaymentTime = values.dateStartAndEnd[1];
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 15 }}
      >
        <div style={{ display: 'flex' }}>
          <Form.Item labelCol={{span:2}} label={'还款状态：'} field={'state'}>
            <RadioGroup
              type="button"
              name="lang"
              style={{ marginRight: 20, marginBottom: 0 }}
            >
              <Radio value={"NO_REPAYMENT"}>未还款</Radio>
              <Radio value={"OVERDUE"}>逾期</Radio>
              <Radio value={"HAS_BEEN_CLEARED"}>已结清</Radio>
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
            <Form.Item label={'用户昵称:'} field="name">
              <Input placeholder={'请输入用户姓名'} allowClear />
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
          <Col span={12}>
            <Form.Item label={"计划还款日"} field={'dateStartAndEnd'}>
              <RangePicker
                style={{ width: 300, margin: '0 0 0 0' }}
                showTime={{
                  defaultValue: ['00:00', '00:00'],
                  format: 'HH:mm',
                }}
                format="YYYY-MM-DD HH:mm"
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
      title: '借款类型',
      dataIndex: 'loanType',
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
    },
    {
      title: 'KTP身份证号',
      dataIndex: 'ktpNo',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '还款金额',
      dataIndex: 'repaymentAmount',
    },
    {
      title: '放款时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '计划还款日',
      dataIndex: 'repaymentDate',
    },
    {
      title: '还款时间',
      dataIndex: 'realRepaymentDate',
    },
    {
      title: '实还金额',
      dataIndex: 'realRepaymentAmount',
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDay',
    },
    {
      title: '逾期金额',
      dataIndex: 'balance',
    },
    {
      title: '还款状态',
      dataIndex: 'state',
      render: (_) => <div>{loanStatus[_]}</div>,
    },
    {
      title: '操作',
      dataIndex: 'state',
      render: (_, record) => {
        return (
          <Space>
            {
              _ !== "HAS_BEEN_CLEARED"  &&   <Button type="primary" size="small" onClick={(e) => callback(record)}>
                手动还款
              </Button>
            }

          </Space>
        )
      }
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
  const [questionVisible1, setQuestionVisible1] = useState(false);
  const [questionVisible2, setQuestionVisible2] = useState(false);
  const [currentConfirmRecord, setCurrentConfirmRecord]: any = useState();
  const [form] = Form.useForm();
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = (record) => {
    setCurrentConfirmRecord(record);
    setQuestionVisible(true);
    form.setFieldsValue({
      ...record
    })
  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const columns = useMemo(()=>getColumns(callBack), []);

  useEffect(() => {
    getData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);


  const clearOrder = (settle) =>{
    setLoading(true);
    setQuestionVisible2(false);
    setQuestionVisible1(false);
    setQuestionVisible(false);
    APIClearOrder({
      ...form.getFieldsValue(),
      settle:settle
    }).then((resp:any)=>{
      if (resp.data){
        Message.success("操作成功！");
        getData();
      }
    }).finally(()=>{
      form.resetFields();
      setLoading(false);
    })
  }

  const getData = (loading?) => {
    if(!loading) setLoading(true);
    APIGetRepaymentPlanList(
      {
        ...formParams,
        size: pagination.pageSize,
        number: pagination.current,
      },
    ).then((resp: any) => {
      if (resp.data) {
        setData(resp.data.content);
        setPatination({
          ...pagination,
          total: resp.data.totalElements,
        });
      }
    }).finally(()=>{
      setLoading(false);
    });
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
          title={"手动还款"}
          body={<div>

            <Form form={form}>
              <Form.Item label={"工单ID"} field={"id"} disabled>
                <Input></Input>
              </Form.Item>
              <Form.Item rules={[{required:true}]} label={"实还金额"} field={"amount"} >
                <InputNumber min={0}></InputNumber>
              </Form.Item>
              <Form.Item label={"备注"} field={"remark"}>
                <Input.TextArea></Input.TextArea>
              </Form.Item>
            </Form>

          </div>}
          visible={questionVisible}
          confirmBtn={true}
          onCancel={() => {
            form.resetFields();
            setQuestionVisible(false)
          }}
          refuseFun={() => {
            form.resetFields();
            setQuestionVisible(false)
          }}
          confirmFun={ async () => {
            try {
              await form.validate()
              setQuestionVisible(false)
              setQuestionVisible1(true)
            } catch (e){
              Message.info("请填写金额")
            }
          }}
          confirm2Fun={ async () => {
            try {
              await form.validate()
              setQuestionVisible(false)
              setQuestionVisible2(true)
            } catch (e){
              Message.info("请填写金额")
            }
          }}
        />

        <ModalAlert
          title={""}
          body={<div>
            手动还款{form.getFieldValue("amount")}
          </div>}
          visible={questionVisible1}
          onCancel={() => {
            form.resetFields();
            setQuestionVisible1(false)
          }}
          refuseFun={() => {
            form.resetFields();
            setQuestionVisible1(false)
          }}
          confirmFun={() => clearOrder(0)}
        />

        <ModalAlert
          title={""}
          body={<div>
            手动还款{form.getFieldValue("amount")}并结清
          </div>}
          visible={questionVisible2}
          onCancel={() => {
            form.resetFields();
            setQuestionVisible2(false)
          }}
          refuseFun={() => {
            form.resetFields();
            setQuestionVisible2(false)
          }}
          confirmFun={() => clearOrder(1)}
        />
      </div>
    </Card>
  );
};

export default WorkOrderCheck;
