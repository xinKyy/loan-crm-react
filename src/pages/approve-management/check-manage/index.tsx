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
  Message, Card,
} from '@arco-design/web-react';
import { IconDown, IconRefresh, IconSearch, IconInfoCircle } from '@arco-design/web-react/icon';
import styles from '../../index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import {
  APIConfirmWithdraw,
  APIGetChargeRecord, APIGetPushList, APIPushListOrder, APIPushOrder,
} from '@/api/api';
import { withDrawUSDT } from '@/utils/web3Util';
import ModalAlert from '@/components/ModalAlert';
const { RangePicker } = DatePicker;
const { useForm } = Form;
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;

const loanStatus = {
  SUBMIT_LOAN: "提交借款申请",
  TO_MAN_REVIEWED: "待人工审核",
  REVIEWED_PASSED: "审核通过",
  REVIEWED_RETUR: "审核退回",
  REVIEWED_REJECT: "审核拒绝",
  PUSHING_SINGLE: "推单成功",
  PUSH_SINGLE_FAIL: "推单失败",
  LOAN_SUCCESS: "放款成功",
  LOAN_FAIL: "放款失败",
  NO_REPAYMENT: "未还款",
  OVERDUE: "逾期",
  HAS_BEEN_CLEARED: "已结清"
};

const showState = ["TO_MAN_REVIEWED", "REVIEWED_PASSED", "REVIEWED_RETUR", "REVIEWED_REJECT"]
const canPushOrderState = ["PUSH_SINGLE_FAIL", "LOAN_FAIL", "REVIEWED_PASSED"]
const cancelAndExitState = ["PUSHING_SINGLE", "LOAN_SUCCESS"]
function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();
  const [orderType, setOrderType] = useState(2);

  const handleSubmit = (params?) => {
    const values = form.getFieldsValue();
    if(params){
      values[params.key] = params.value
    }
    values.orderType = orderType;

    if (values.orderType === 2) {
      delete values.orderType;
    }

    if (values.status === 'all') {
      delete values.status;
    }

    if (values.dateStartAndEnd) {
      values.startTime = values.dateStartAndEnd[0];
      values.endTime = values.dateStartAndEnd[1];
    }

    for(const key in values){
      if(values[key] == ""){
        delete values[key];
      }
    }

    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({
      check:0,
      symbol:"USDT"
    })
    props.onSearch({
      check:0,
      symbol:"USDT"
    });
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
          <Form.Item labelCol={{span:2}} label={'工单状态：'} field={'state'}>
            <RadioGroup
              type="button"
              name="lang"
            >
              <Radio value={0}>待推单</Radio>
              <Radio value={"PUSHING_SINGLE"}>推单成功</Radio>
              <Radio value={"PUSH_SINGLE_FAIL"}>推单失败</Radio>
              <Radio value={"LOAN_SUCCESS"}>放款成功</Radio>
              <Radio value={"LOAN_FAIL"}>放款失败</Radio>
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
            <Form.Item label={'KTP账号:'} field="idCardNo">
              <Input placeholder={'请输入KTP账号'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={"借款时间"} field={'dateStartAndEnd'}>
              <RangePicker
                style={{ width: 300, margin: '0 0 0 0' }}
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
      render:(_)=><div>{_ === 1 ? "首次借款" : "多次借款"}</div>
    },
    {
      title: '借款类型',
      dataIndex: 'loanType',
    },
    {
      title: '工单状态',
      dataIndex: 'state',
      render:(_)=><div>{loanStatus[_]}</div>
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
      render:(_)=><div>{_}天</div>
    },
    {
      title: '借款时间',
      dataIndex: 'gmtCreate',
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
            <Space>
              <Button disabled={!canPushOrderState.includes(record.state)} type="primary" size="small" onClick={(e) => callback(record, "审核")}>
                推单
              </Button>
              {

                // <Button disabled={!cancelAndExitState.includes(record.state)} type="default" status={"danger"} size="small" onClick={(e) => callback(record, "取消")}>
                //   取消
                // </Button>
                // <Button disabled={!cancelAndExitState.includes(record.state)} type="dashed" status={"warning"} size="small" onClick={(e) => callback(record, "关闭")}>
                // 关闭
                // </Button>

              }
            </Space>
          </>
        )
      }
    },
  ];
};

const ApproveManagement = () => {
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
  const [pushOrderListVisible, setPushOrderListVisible] = useState(false);
  const [currentConfirmRecord, setCurrentConfirmRecord]: any = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = (record) => {
    setCurrentConfirmRecord(record);
    setQuestionVisible(true);
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


  const getData = (loading?) => {
    if(!loading) setLoading(true);
    APIGetPushList(
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


  const confirmQuestion = () => {
    setQuestionVisible(false);
    setLoading(true);
    APIPushOrder({
      orderId: currentConfirmRecord?.id,
    })
      .then((resp: any) => {
        if (resp.data) {
          Message.success('已推单成功！');
          getData();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pushOrderList =  () => {
    if(selectedRowKeys && selectedRowKeys.length > 0){
      setPushOrderListVisible(false);
      setLoading(true);
      APIPushListOrder({
        orderId: selectedRowKeys,
      })
        .then((resp: any) => {
          if (resp.data) {
            Message.success('已批量推单成功！');
            setSelectedRowKeys([]);
            getData();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Message.info('请选择需要推的工单！');
    }
  }

  return (
    <Card>
      <div>
        <SearchForm onSearch={handleSearch}></SearchForm>
        <div style={{display:"flex", justifyContent:"flex-end", marginBottom:"20px"}}>
          <Button type={"primary"} onClick={()=>{
            if(selectedRowKeys && selectedRowKeys.length > 0){
              setPushOrderListVisible(true);
            } else {
              Message.info('请选择需要推的工单！');
            }
          }}>批量推单</Button>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
          rowSelection={{
            type:"checkbox",
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
            },
            onSelect: (selected, record, selectedRows) => {
            },
            checkboxProps: (record) => {
              return {
                disabled: !canPushOrderState.includes(record.state),
              };
            },
          }}
        />


        <ModalAlert
          title={"推单"}
          body={<div>
            <IconInfoCircle style={{color:"#ff0000", fontSize:"16px"}} />
            确认推单【{currentConfirmRecord?.orderNo}】？
          </div>}
          visible={questionVisible}
          onCancel={() => setQuestionVisible(false)}
          refuseFun={() => setQuestionVisible(false)}
          confirmFun={() => confirmQuestion()}
        />

        <ModalAlert
          title={"批量推单"}
          body={<div>
            <IconInfoCircle style={{color:"#ff0000", fontSize:"16px"}} />
            确认批量推单【{selectedRowKeys.join(",")}】？
          </div>}
          visible={pushOrderListVisible}
          onCancel={() => setPushOrderListVisible(false)}
          refuseFun={() => setPushOrderListVisible(false)}
          confirmFun={() => pushOrderList()}
        />
      </div>
    </Card>
  );
};

export default ApproveManagement;
