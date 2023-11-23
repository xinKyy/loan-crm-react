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
  Message,
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
  APICreateAdminUser,
  APIDeleteAdminUser,
  APIEditAdminUserPassword,
  APIGetAdminUserList,
} from '@/api/api';
const Row = Grid.Row;
const Col = Grid.Col;
const { RangePicker } = DatePicker;
const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];
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
    if (type === 'editPassword') {
      setEditPasswordVisible(true);
    }
    if (type === 'delete') {
      setDeleteVisible(true);
    }
    if (type === 'edit') {
      setModalVisible(true);
    }
  };

  const columns = useMemo(() => getColumns(t, tableCallback), [t]);

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(false);
  const [formParams, setFormParams] = useState({});
  const [currentRecord, setCurrentRecord]: any = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [addAdminVisible, setAddAdminVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);

  useEffect(() => {
    getAdminUserList();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const getAdminUserList = () => {
    setLoading(true);
    APIGetAdminUserList({
      ...formParams,
    })
      .then((resp: any) => {
        if (resp.result) {
          setData(resp.result.records);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const createAdminUser = () => {
    if (
      addForm.getFieldsValue().password !== addForm.getFieldsValue().rePassword
    ) {
      return Message.error('两次密码需要一致！');
    }
    setAddAdminVisible(false);
    setLoading(true);
    APICreateAdminUser({
      ...addForm.getFieldsValue(),
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('增加管理员成功！');
          getAdminUserList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteAdminUser = () => {
    setDeleteVisible(false);
    setLoading(true);
    APIDeleteAdminUser({
      id: currentRecord?.id,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('删除管理员成功！');
          getAdminUserList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
  return (
    <Card>
      <SearchForm onSearch={handleSearch}></SearchForm>
      <Button onClick={() => setAddAdminVisible(true)} type={'primary'}>
        创建管理员
      </Button>
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
        title={'编辑管理员'}
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
        <Input addBefore="管理员姓名" placeholder="请输入管理员姓名" />
        <div style={{ height: 20 }} />
        <Input
          addBefore="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;帐号"
          placeholder="请输入管理员帐号"
        />
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', marginLeft: '20px' }}>
          <div>是否可用:</div>
          <div style={{ width: 20 }} />
          <Switch></Switch>
        </div>
      </Modal>

      <Modal
        title={'添加管理员'}
        visible={addAdminVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => {
          createAdminUser();
        }}
        onCancel={() => setAddAdminVisible(false)}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={addForm}>
          <div style={{ height: 20 }} />
          <Form.Item label={'管理员姓名'} field={'realName'}>
            <Input placeholder="请输入管理员姓名" />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item label={'账号'} field={'userName'}>
            <Input placeholder="请输入管理员帐号" />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item label={'密码'} field={'password'}>
            <Input placeholder="请输入管理员密码" />
          </Form.Item>

          <div style={{ height: 20 }} />
          <Form.Item label={'确认密码'} field={'rePassword'}>
            <Input placeholder="请确认管理员密码" />
          </Form.Item>
          <div style={{ height: 20 }} />
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
        onOk={() => deleteAdminUser()}
        onCancel={() => setDeleteVisible(false)}
        okText={'确定'}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.warning}></div>确认删除【
          {currentRecord?.userName}】管理员吗？
        </div>
      </Modal>
    </Card>
  );
}

export default SearchTable;
