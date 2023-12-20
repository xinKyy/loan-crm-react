import React, {useContext, useEffect, useState} from 'react';
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
import styles from './style/index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import { Status } from '@/pages/list/help-table/constants';
import {APIAddScheduled, APIGetAISPriceConfigList, APIRemoveAisConfig} from '@/api/api';
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
            <Form.Item label={'用户昵称:'} field="orderNo">
              <Input placeholder={'请输入用户昵称'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'订单号:'} field="orderNo">
              <Input placeholder={'请输入订单号'} allowClear />
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
      title: '标题',
      dataIndex: 'scheduledName',
    },
    {
      title: '币价',
      dataIndex: 'price',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render:(_, record)=><div>{new Date(_).toLocaleString()}</div>
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render:(_, record)=><div>{new Date(_).toLocaleString()}</div>
    },
    {
      title: '状态',
      dataIndex: 'status',
      render:(_, record) => <div>{_ === 0 ? "未开始" : "已开始执行"}</div>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render:(_, record)=><div>{new Date(_).toLocaleString()}</div>
    },
    {
      title: "操作",
      dataIndex: "createTime",
      render:(_, record)=>{
        return <Button type={"primary"} onClick={()=>callback(record)}>删除</Button>
      }
    }
  ];
};

const TimerPriceTableComponents = () => {
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    total: 0,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [formParams, setFormParams] = useState({});
  const [addForm] = useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [currentRecord, setCurrentRecord]: any = useState();
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = (record) => {
    setCurrentRecord(record);
    setDeleteVisible(true);
  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const getAisPriceTable = () =>{
    APIGetAISPriceConfigList({

    }).then((resp:any) =>{
      if(resp.result){
        setData(resp.result)
      }
    })
  }

  useEffect(()=>{
    getAisPriceTable();
  }, [])

  const changePostStatus = (record) =>{
    setLoading(true);
    setDeleteVisible(false);
    APIRemoveAisConfig({id:record.id}).then((resp:any)=>{
      if(resp.result){
        Message.success("删除成功");
      }
    }).finally(()=>{
      setLoading(false);
      getAisPriceTable();
    })
  }

  return (
    <div>
      {/*<SearchForm onSearch={handleSearch}></SearchForm>*/}
      <div style={{ height: '10px' }}></div>
      <Button type={'primary'} onClick={() => setAddVisible(true)}>
        添加定时
      </Button>
      <div style={{ height: '30px' }}></div>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns(callBack)}
        data={data}
      />

      <Modal
        title={'添加定时币价'}
        visible={addVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => {
          setLoading(true);
          setAddVisible(false);
          APIAddScheduled(
            JSON.stringify({
              ...addForm.getFieldsValue(),
              time:
                addForm.getFieldValue('time')[0] +
                '|' +
                addForm.getFieldValue('time')[1],
            })
          )
            .then((resp: any) => {
              if (resp.result) {
                Message.success('增加成功！');
                getAisPriceTable();
              }
            })
            .finally(() => {
              setLoading(false);
              addForm.resetFields();
            });
        }}
        onCancel={() => setAddVisible(false)}
        okText={'提交'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={addForm}>
          <div style={{ height: 20 }} />
          <Form.Item
            rules={[{ required: true }]}
            required
            label={'定时标题'}
            field={'title'}
          >
            <Input placeholder="请输入定时标题" />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item
            rules={[{ required: true }]}
            required
            label={'币价'}
            field={'price'}
          >
            <Input type={'number'} placeholder="请输入币价" />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item
            required
            rules={[{ required: true }]}
            label={'执行时间'}
            field={'time'}
          >
            <DatePicker.RangePicker
              showTime={{
                defaultValue: ['00:00', '00:00'],
                format: 'HH:mm',
              }}
              format="YYYY-MM-DD HH:mm"
            ></DatePicker.RangePicker>
          </Form.Item>
          <div style={{ height: 20 }} />
        </Form>
      </Modal>

      <Modal
        title={'提示'}
        visible={deleteVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => changePostStatus(currentRecord)}
        onCancel={() => setDeleteVisible(false)}
        okText={'确定'}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.warning}></div>确认删除【
          {currentRecord?.scheduledName}】吗？
        </div>
      </Modal>

    </div>
  );
};

export default TimerPriceTableComponents;
