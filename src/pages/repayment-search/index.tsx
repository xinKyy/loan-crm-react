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
import styles from '../index.module.less';
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 15 }}
      >
        <div style={{ display: 'flex' }}>
          <Form.Item labelCol={{span:2}} label={'还款状态：'} initialValue={0} field={'check'}>
            <RadioGroup
              type="button"
              name="lang"
              defaultValue={0}
              style={{ marginRight: 20, marginBottom: 0 }}
            >
              <Radio onClick={()=>handleSubmit({key:"check", value:0})} value={0}>未还款</Radio>
              <Radio onClick={()=>handleSubmit({key:"check", value:1})}  value={1}>逾期</Radio>
              <Radio onClick={()=>handleSubmit({key:"check", value:2})}  value={2}>已结清</Radio>
            </RadioGroup>
          </Form.Item>
        </div>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item label={'工单ID:'} field="account">
              <Input placeholder={'请输入工单ID'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'用户昵称:'} field="account">
              <Input placeholder={'请输入用户姓名'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'客户手机号:'} field="account">
              <Input placeholder={'请输入用户姓名'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'KTP账号:'} field="address">
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
      dataIndex: 'id',
    },
    {
      title: '借款类型',
      dataIndex: 'amount',
    },
    {
      title: '客户姓名',
      dataIndex: 'symbol',
    },
    {
      title: 'KTP身份证号',
      dataIndex: 'status',
    },
    {
      title: '手机号码',
      dataIndex: 'status',
    },
    {
      title: '还款金额',
      dataIndex: 'fee',
    },
    {
      title: '放款时间',
      dataIndex: 'fee',
    },
    {
      title: '计划还款日',
      dataIndex: 'fee',
    },
    {
      title: '还款时间',
      dataIndex: 'fee',
    },
    {
      title: '实还金额',
      dataIndex: 'fee',
    },
    {
      title: '逾期天数',
      dataIndex: 'fee',
    },
    {
      title: '逾期金额',
      dataIndex: 'fee',
    },
    {
      title: '还款状态',
      dataIndex: 'fee',
    },
    {
      title: '操作',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Space>
            <Button type="primary" size="small" onClick={(e) => callback(record)}>
              手动还款
            </Button>
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
            <IconInfoCircle style={{color:"#ff0000", fontSize:"16px"}} />
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
