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
  APIAddVersion,
  APIConfirmWithdraw, APIDeleteVersion, APIEditVersion,
  APIGetChargeRecord, APIGetRepaymentPlanList, APIGetVersionList, APIOrderGetList,
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
            <Form.Item label={'平台:'} field="platform">
              <Input placeholder={'请输入平台'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'版本名:'} field="name">
              <Input placeholder={'请输入版本名'} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'版本号:'} field="buildNo">
              <Input placeholder={'请输入版本号'} allowClear />
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
      title: '版本号',
      dataIndex: 'buildNo',
    },
    {
      title: '版本名字',
      dataIndex: 'name',
    },
    {
      title: '版本内容',
      dataIndex: 'content',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '平台',
      dataIndex: 'platform',
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    {
      title: '操作',
      dataIndex: 'version',
      render:(_, re) =>{
        return <Space>
          <Button type="primary"  onClick={()=>callback(re, "delete")}>删除</Button>
          <Button type="primary"  onClick={()=>callback(re, "edit")}>编辑</Button>
        </Space>
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
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [addVis, setAddVis] = useState(false);
  const [editVis, setEditVis] = useState(false);
  const [currentConfirmRecord, setCurrentConfirmRecord]: any = useState();
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = (record, type) => {
    setCurrentConfirmRecord({
      ...record
    });
    if(type == "delete"){
      setQuestionVisible(true);
    } else {
      setEditVis(true);
      form2.setFieldsValue(record);
    }
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
    APIGetVersionList(
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
    APIDeleteVersion({
      id: currentConfirmRecord?.id,
    })
      .then((resp: any) => {
        if (resp.data) {
          Message.success('已删除该版本');
          getData();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createNewVersion = (create) => {
    setAddVis(false);
    setEditVis(false);
    setLoading(true);
    if (create){
     APIAddVersion({
       ...form.getFieldsValue()
     })
       .then((resp: any) => {
         if (resp.data) {
           Message.success('已创建新版本');
           getData();
         }
       })
       .finally(() => {
         setLoading(false);
       });
   } else {
      APIEditVersion({
        ...form2.getFieldsValue()
      })
        .then((resp: any) => {
          if (resp.data) {
            Message.success('已更新版本');
            getData();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Card>
      <div>
        <SearchForm onSearch={handleSearch}></SearchForm>
        <Button type={"primary"} onClick={()=>setAddVis(true)}>新增版本</Button>
        <div style={{height:"20px"}}></div>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />


        <ModalAlert
          title={"删除版本"}
          body={<div>
            <IconInfoCircle style={{color: "#ff0000", fontSize: "16px"}}/>
            此操作会删除版本【{currentConfirmRecord?.name}】
          </div>}
          visible={questionVisible}
          onCancel={() => setQuestionVisible(false)}
          refuseFun={() => setQuestionVisible(false)}
          confirmFun={() => confirmQuestion()}
        />

        <ModalAlert
          title={"新增版本"}
          body={<div>
            <Form form={form}>
              <Form.Item label={"版本名"} field={"name"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"标题"} field={"title"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本内容"} field={"content"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本链接"} field={"url"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本号"} field={"buildNo"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"平台"} field={"platform"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本"} field={"version"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"强制更新"} field={"mandatoryUpdated"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"md5state"} field={"md5state"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"ordernum"} field={"ordernum"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"下载方法"} field={"installMethod"}>
                <Input></Input>
              </Form.Item>
            </Form>
          </div>}
          visible={addVis}
          onCancel={() => setAddVis(false)}
          refuseFun={() => setAddVis(false)}
          confirmFun={() => createNewVersion(true)}
        />

        <ModalAlert
          title={"修改版本"}
          body={<div>
            <Form form={form2}>
              <Form.Item label={"版本名"} field={"name"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"标题"} field={"title"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本内容"} field={"content"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本链接"} field={"url"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本号"} field={"buildNo"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"平台"} field={"platform"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"版本"} field={"version"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"强制更新"} field={"mandatoryUpdated"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"md5state"} field={"md5state"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"ordernum"} field={"ordernum"}>
                <Input></Input>
              </Form.Item>
              <Form.Item label={"下载方法"} field={"installMethod"}>
                <Input></Input>
              </Form.Item>
            </Form>
          </div>}
          visible={editVis}
          onCancel={() => setEditVis(false)}
          refuseFun={() => setEditVis(false)}
          confirmFun={() => createNewVersion(false)}
        />
      </div>
    </Card>
  );
};

export default WorkOrderCheck;
