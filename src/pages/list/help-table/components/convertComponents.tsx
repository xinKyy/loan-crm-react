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
const typeList = [
  '互转',
  '提现',
  'AI投资',
  'AI复投',
  '投资收益',
  '推荐收益',
  '分享奖励释放',
  '管理奖励释放',
  '业绩奖励释放',
  '充值',
  '后台充值',
  '充值回收',
  '提现失败',
];

const accountType = [
  'USDT（不可提现）',
  'USDT（可提现）',
  'AIS不可提现',
  'AIS可提现',
];

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
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={'币种类型：'} field={'symbol'}>
              <RadioGroup
                type="button"
                name="lang"
                defaultValue="0"
                style={{ marginRight: 20, marginBottom: 0 }}
              >
                <Radio value="0">USDT</Radio>
                <Radio value="1">AIS</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
        </Row>
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
      title: '转账用户',
      dataIndex: 'accountFrom',
    },
    {
      title: '收款用户',
      dataIndex: 'accountTo',
    },
    {
      title: '互转数量',
      dataIndex: 'amount',
    },
    {
      title: '手续费',
      dataIndex: 'fee',
    },
    {
      title: '币种',
      dataIndex: 'symbol',
    },
    {
      title: '账户类型',
      dataIndex: 'type',
      render: (_, record) => <div>{accountType[parseInt(_) + 1]}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
};

const ConvertComponents = () => {
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
      'getTransferDetail'
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
        columns={columns(callBack)}
        data={data}
      />
    </div>
  );
};

export default ConvertComponents;
