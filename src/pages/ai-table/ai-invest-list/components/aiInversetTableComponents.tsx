import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import useLocale from '@/utils/useLocale';
import { IconDown, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from '../style/index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import { Status } from '@/pages/list/help-table/constants';
import { APIGetChargeRecord } from '@/api/api';
const { RangePicker } = DatePicker;
const { useForm } = Form;
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;
const orderTypeList = ['得到帮助', '提供帮助', '全部'];
function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();
  const [orderType, setOrderType] = useState(2);

  const handleSubmit = () => {
    const values = form.getFieldsValue();

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
        wrapperCol={{ span: 21 }}
      >
        <div style={{ display: 'flex' }}>
          <Form.Item label={'时间选择：'} field={'dateStart'}>
            <RadioGroup
              type="button"
              name="lang"
              defaultValue="all"
              style={{ marginBottom: 0 }}
            >
              <Radio value="all">全部</Radio>
              <Radio value={0}>今天</Radio>
              <Radio value={2}>昨天</Radio>
              <Radio value={7}>最近7天</Radio>
              <Radio value={30}>最近30天</Radio>
              <Radio value="1m">本月</Radio>
              <Radio value="1y">本年</Radio>
            </RadioGroup>
          </Form.Item>
          <Form.Item field={'dateStartAndEnd'}>
            <RangePicker
              style={{ width: 360, margin: '0 0 0 0' }}
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
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={'用户昵称:'} field="account">
              <Input placeholder={'请输入用户昵称'} allowClear />
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

const columns = (callback) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户昵称',
      dataIndex: 'account',
    },
    // {
    //   title: '订单号',
    //   dataIndex: 'orderType',
    // },
    {
      title: '订单价值（USDT）',
      dataIndex: 'orderPrice',
    },
    {
      title: '消耗USDT数量',
      dataIndex: 'comsumerUsdt',
    },
    {
      title: '消耗AIS数量',
      dataIndex: 'comsumerAis',
    },
    {
      title: 'AIS币价',
      dataIndex: 'aisPrice',
    },
    {
      title: '杠杆倍数',
      dataIndex: 'times',
    },
    {
      title: '日益率（%）',
      dataIndex: 'status',
      render: () => <div>0.5%</div>,
    },
    {
      title: '是否首次投资',
      dataIndex: 'isFirst',
      render: (_, record) => <div>{_ === 1 ? '是' : '否'}</div>,
    },
    {
      title: 'USDT累计收益',
      dataIndex: 'usdtTotal',
    },
    {
      title: 'AIS累计收益',
      dataIndex: 'aisTotal',
    },
    {
      title: '价值累计收益（USDT）',
      dataIndex: 'total',
    },
    {
      title: '最高可收益价值（USDT）',
      dataIndex: 'maxIncome',
    },
    {
      title: '是否结束',
      dataIndex: 'isEnd',
      render: (_, record) => <div>{_ ? '是' : '否'}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
};

const AiInvestTableComponents = () => {
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
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = () => {
    console.log('callBack');
  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  useEffect(() => {
    getData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  const getData = () => {
    APIGetChargeRecord(
      {
        ...formParams,
        page_size: pagination.pageSize,
        page_num: pagination.current,
      },
      'aiResubRecord'
    ).then((resp: any) => {
      if (resp.result) {
        setData(resp.result.records);
        setPatination({
          ...pagination,
          total: resp.result.total,
        });
      }
    });
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch}></SearchForm>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        scroll={{
          x: 2000,
        }}
        columns={columns(callBack)}
        data={data}
      />
    </div>
  );
};

export default AiInvestTableComponents;
