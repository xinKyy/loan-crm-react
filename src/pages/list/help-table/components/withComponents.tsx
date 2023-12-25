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
  Modal,
  Message,
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import useLocale from '@/utils/useLocale';
import { IconDown, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from '../style/index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import { Status } from '@/pages/list/help-table/constants';
import {
  APIConfirmQuestion,
  APIConfirmWithdraw,
  APIGetChargeRecord,
} from '@/api/api';
import { withDrawUSDT } from '@/utils/web3Util';
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
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={'操作类型：'} field={'check'}>
              <RadioGroup
                type="button"
                name="lang"
                defaultValue="3"
                style={{ marginRight: 20, marginBottom: 0 }}
              >
                <Radio value="0">待审核</Radio>
                <Radio value="1">已审核</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'币种类型：'} field={'status'}>
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
          <Col span={12}>
            <Form.Item label={'提现地址:'} field="address">
              <Input placeholder={'请输入提现地址'} allowClear />
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
      title: '订单编号',
      dataIndex: 'id',
    },
    {
      title: '用户昵称',
      dataIndex: 'account',
    },
    {
      title: '提现地址',
      dataIndex: 'address',
    },
    {
      title: '提现数量',
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
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <div>{_ === 0 ? '待审核' : _ === 1 ? '已审核' : '已拒绝'}</div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'status',
      render: (_, record) =>
        _ === 0 ? (
          <Button type="text" size="small" onClick={(e) => callback(record)}>
            审核
          </Button>
        ) : null,
    },
  ];
};

const WithdrawComponents = () => {
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
      'getWithdrawList'
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

      <Modal
        title="提现订单"
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
        <p>同意提现申请并打款</p>
      </Modal>
    </div>
  );
};

export default WithdrawComponents;
