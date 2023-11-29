import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Drawer,
  Skeleton,
  Grid,
  Tag,
  Tabs,
  Divider,
  Image,
  TableColumnProps,
  Modal,
  Input,
  Checkbox,
  Radio,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Switch,
  Form,
  Message, Statistic,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDown, IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import './mock';
import { getColumns } from './constants';
import qrPng from '../../../../src/imgs/qrcode.png';
import {
  APICreateAdminUser, APICreateBackUser,
  APIDeleteAdminUser, APIDeleteBackUser,
  APIEditAdminUserPassword,
  APIGetAdminUserList, APIGetHelpList, APIGetListBackOrder, APIGetOfferOrderList, APIMatchAdminOrder,
} from '@/api/api';
const Row = Grid.Row;
const Col = Grid.Col;
const { RangePicker } = DatePicker;
const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];
const Countdown = Statistic.Countdown;
const RadioGroup = Radio.Group;
const dropList = (
  <Menu>
    <Menu.Item key="1">普通会员</Menu.Item>
    <Menu.Item key="2">钻石</Menu.Item>
    <Menu.Item key="3">大使</Menu.Item>
    <Menu.Item key="3">总裁</Menu.Item>
  </Menu>
);
const { useForm } = Form;
function SearchTable() {
  const t = useLocale(locale);
  const [addForm] = useForm();
  const tableCallback = async (record, type, e) => {
    if (e) e.stopPropagation();
    if (!currentRecord || record.id !== currentRecord?.id) {
      setCurrentRecord(record);
    }
    if (type === 'match') {
      getMatchOrderList();
      setMatchVisible(true);
    }
    if (type === 'delete') {
      setDeleteVisible(true);
    }
    if (type === 'details') {
      setModalVisible(true);
      getListBackUserMatchListById(record);
    }
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);

  const [data, setData] = useState([]);
  const [childData, setChildData] = useState([]);
  const [matchOrderData, setMatchOrderData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    total: 0,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });

  const [matchOrderPagination, setMatchOrderPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    total: 0,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });

  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [formParams, setFormParams] = useState({});
  const [currentRecord, setCurrentRecord]: any = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [addAdminVisible, setAddAdminVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [matchVisible, setMatchVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [key, setKey] = useState("");
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);

  useEffect(() => {
    getAdminGetHelpList();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  useEffect(()=>{
    getMatchOrderList();
  },[matchOrderPagination.current, matchOrderPagination.pageSize, JSON.stringify(formParams)]);

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const getAdminGetHelpList = () => {
    setLoading(true);
    APIGetHelpList({
      // page_size: pagination.pageSize,
      // page_num: pagination.current,
    })
      .then((resp: any) => {
        if (resp.result) {
          setData(resp.result);
          // setPatination({
          //   ...pagination,
          //   total: resp.result.total,
          // });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMatchOrderList = () => {
    setMatchLoading(true);
    APIGetOfferOrderList({
      page_size: matchOrderPagination.pageSize,
      page_num: matchOrderPagination.current,
    })
      .then((resp: any) => {
        if (resp.result) {
          setChildData(resp.result.records);
          setMatchOrderPatination({
            ...matchOrderPagination,
            total: resp.result.total,
          });
        }
      })
      .finally(() => {
        setMatchLoading(false);
      });
  };

  const deleteBackUser = () => {
    setDeleteVisible(false);
    setLoading(true);
    APIDeleteBackUser({
      id: currentRecord?.id,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('删除后台账户成功！');
          getAdminGetHelpList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const matchOrder = () => {
    setLoading(true);
    setMatchVisible(false);
    APIMatchAdminOrder({
      backUserId:currentRecord.id,
      offerIds:selectedRowKeys
    }).then((resp:any) =>{
      if(resp.result){
        Message.success("匹配成功！");
      }
    }).finally(()=>{
      setLoading(false);
    });
  }

  const editAdminUserPassword = () => {
    if (currentRecord.passwordV2 !== currentRecord.rePassword) {
      return Message.error('两次密码需要一致！');
    }
    setEditPasswordVisible(false);
    setLoading(true);
    APIEditAdminUserPassword({
      email: currentRecord?.userName,
      newPassword: currentRecord.passwordV2,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('修改管理员密码成功！');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createBackUser = () =>{
    setAddAdminVisible(false);
    setLoading(true);
    APICreateBackUser({
      ...addForm.getFieldsValue()
    }).then((resp: any) => {
      if(resp.result) {
        Message.success("增加后台匹配账户成功！");
        getAdminGetHelpList();
      }
    }).finally(()=>{
      setLoading(false);
      addForm.resetFields();
    })
  }

  const getListBackUserMatchListById = (record) =>{
    setMatchLoading(true);
    APIGetListBackOrder({
      id:record.id
    }).then((resp :any)=>{
      if(resp.result){
        setMatchOrderData(resp.result);
      }
    }).finally(()=>{
      setMatchLoading(false);
    })
  }

  return (
    <Card>
      <Row>
        <Space>
          <Button onClick={() => setAddAdminVisible(true)} type={'primary'}>
            添加匹配账户
          </Button>
        </Space>
      </Row>
      <div style={{ height: 20 }} />
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />

      <Modal
        title={'修改管理员密码'}
        visible={editPasswordVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => {
          editAdminUserPassword();
        }}
        onCancel={() => setEditPasswordVisible(false)}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <Input
          addBefore="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码"
          placeholder="请输入密码"
          value={currentRecord?.passwordV2}
          onChange={(v) =>
            setCurrentRecord({ ...currentRecord, passwordV2: v })
          }
        />
        <div style={{ height: 20 }} />
        <Input
          addBefore="确认密码"
          placeholder="请再次输入密码"
          value={currentRecord?.rePassword}
          onChange={(v) =>
            setCurrentRecord({ ...currentRecord, rePassword: v })
          }
        />
      </Modal>

      <Modal
        title={'添加匹配账户'}
        visible={addAdminVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => {
          createBackUser();
        }}
        onCancel={() => setAddAdminVisible(false)}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={addForm}>
          <div style={{ height: 20 }} />
          <Form.Item label={'账户昵称'} field={'name'} required>
            <Input placeholder="请输入账户昵称" />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item label={'账户收款地址'} field={'address'} required>
            <Input placeholder="账户收款地址" />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item label={'初始静态余额'} field={'initAccount'} required>
            <Input placeholder="请输入静态余额" />
          </Form.Item>
        </Form>

        {/*<div style={{ display: 'flex', marginLeft: '20px' }}>*/}
        {/*  <div>是否可用:</div>*/}
        {/*  <div style={{ width: 20 }} />*/}
        {/*  <Switch></Switch>*/}
        {/*</div>*/}
      </Modal>

      <Modal
        title={'提示'}
        visible={deleteVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => deleteBackUser()}
        onCancel={() => setDeleteVisible(false)}
        okText={'确定'}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.warning}></div>确认删除【
          {currentRecord?.name}】后台匹配账户吗？
        </div>
      </Modal>

      <Modal
        title={'可匹配首单提供帮助订单'}
        visible={matchVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => {
          matchOrder();
        }}
        onCancel={() => setMatchVisible(false)}
        okText={'确定'}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <Table
          rowKey="id"
          loading={matchLoading}
          columns={mateColumns}
          data={childData}
          rowSelection={{
            type: 'checkbox',
            checkAll: false,
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
            },
            onSelect: (selected, record, selectedRows) => {
              console.log('');
            },
          }}
        />
      </Modal>

      <Modal
        title={'已匹配记录'}
        visible={modalVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <Table
          rowKey="id"
          columns={mateColumns}
          data={matchOrderData}
          loading={matchLoading}
        />
      </Modal>

    </Card>
  );
}

const mateColumns: TableColumnProps[] = [
  {
    title: '订单编号',
    dataIndex: 'id',
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
  },
  {
    title: '账户来源',
    dataIndex: 'username',
    render: () => <div>用户</div>,
  },
];

export default SearchTable;
