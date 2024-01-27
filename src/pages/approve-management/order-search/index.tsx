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
  Message, Card, Tabs, Descriptions, PageHeader, Divider,
} from '@arco-design/web-react';
import { IconDown, IconRefresh, IconSearch, IconInfoCircle } from '@arco-design/web-react/icon';
import styles from '../../index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import {
  APIConfirmWithdraw,
  APIGetChargeRecord,
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
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label={'工单ID:'} field="account">
              <Input placeholder={'请输入工单ID'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'客户手机号:'} field="account">
              <Input placeholder={'请输入客户手机号'} allowClear />
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


const getColumns = () => {
  return [
    {
      title: '工单ID',
      dataIndex: 'id',
    },
    {
      title: '借款类型',
      dataIndex: 'account',
    },
    {
      title: '工单状态',
      dataIndex: 'address',
    },
    {
      title: '借款本金',
      dataIndex: 'amount',
    },
    {
      title: '工单状态',
      dataIndex: 'fee',
    },
    {
      title: '借款本金',
      dataIndex: 'createTime',
    },
    {
      title: '借款期限',
      dataIndex: 'createTime',
    },
    {
      title: '借款时间',
      dataIndex: 'createTime',
    },
    {
      title: '计划还款日',
      dataIndex: 'createTime',
    },
    {
      title: '实还金额',
      dataIndex: 'createTime',
    },
    {
      title: '还款状态',
      dataIndex: 'createTime',
    },
    {
      title: '逾期天数',
      dataIndex: 'createTime',
    },
  ];
};

const OrderDetailView = () =>{

  const baseData = [
    {
      label: 'Name',
      value: 'Socrates',
    },
    {
      label: 'Mobile',
      value: '123-1234-1234',
    },
    {
      label: 'Residence',
      value: 'Beijing',
    },
    {
      label: 'Hometown',
      value: 'Beijing',
    },
    {
      label: 'Date of Birth',
      value: '2020-05-15',
      span: 2,
    },
    {
      label: 'Address',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
  ];

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
  const columns = useMemo(()=>getColumns(), []);

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  return <Card style={{minHeight:"100vh"}}>
    <SearchForm onSearch={handleSearch}></SearchForm>
    <Descriptions border data={baseData} />
    <div style={{height:"20px"}}></div>
    <Descriptions border data={baseData} />
    <Divider />
    <Table
      data={data}
      columns={columns}
    />
    <Divider />
    <Descriptions border data={baseData} />
  </Card>
}

export default OrderDetailView;
