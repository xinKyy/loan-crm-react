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
  APIGetChargeRecord, APIGetRepaymentPlanList, APIOrderGetList,
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

    if (values.dateStart && values.dateStart != 'all') {
      values.start = new Date(getStartOfDay(values.dateStart));
    }
    if (values.dateStartAndEnd) {
      values.start = new Date(values.dateStartAndEnd[0]);
      values.end = new Date(values.dateStartAndEnd[1]);
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
              <Input placeholder={'请输入用户姓名'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'KTP账号:'} field="address">
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
      dataIndex: 'idCard',
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
      title: '计划还款日',
      dataIndex: 'promiseToPayDate',
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDay',
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
  const [currentConfirmRecord, setCurrentConfirmRecord]: any = useState();
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
    APIOrderGetList(
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


  const confirmQuestion = (type) => {
    setQuestionVisible(false);
    setLoading(true);

    if (type === -1) {
      APIConfirmWithdraw({
        id: currentConfirmRecord?.id,
        status: type,
      })
        .then((resp: any) => {
          if (resp.result) {
            Message.success('已拒绝该笔提现');
            getData();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      withDrawUSDT(
        currentConfirmRecord.address,
        currentConfirmRecord.amount
      ).then((resp) => {
        if (resp.result) {
          APIConfirmWithdraw({
            id: currentConfirmRecord?.id,
            status: type,
          })
            .then((resp: any) => {
              if (resp.result) {
                Message.success('同意提现成功！');
                getData();
              }
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
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
          title={"取消工单"}
          body={<div>
            <IconInfoCircle style={{color: "#ff0000", fontSize: "16px"}}/>
            此操作会取消工单号
          </div>}
          visible={questionVisible}
          onCancel={() => setQuestionVisible(false)}
          refuseFun={() => confirmQuestion(-1)}
          confirmFun={() => confirmQuestion(1)}
        />
      </div>
    </Card>
  );
};

export default WorkOrderCheck;
