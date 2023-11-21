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
  InputNumber, DatePicker, Switch,
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

function SearchTable() {
  const t = useLocale(locale);

  const tableCallback = async (record, type, e) => {
    if (e) e.stopPropagation();
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
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);
    axios
      .get('/api/list', {
        params: {
          page: current,
          pageSize,
          ...formParams,
        },
      })
      .then((res) => {
        setData(res.data.list);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.data.total,
        });
        setLoading(false);
      });
  }

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const cancelModal = () => {
    setModalVisible(false);
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
    <Card>
      <Row>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>
          时间选择：
        </div>
        <RadioGroup
          type="button"
          name="lang"
          defaultValue="dateAll"
          style={{ marginRight: 20, marginBottom: 20 }}
        >
          <Radio value="dateAll">全部</Radio>
          <Radio value="d1">今天</Radio>
          <Radio value="d2">昨天</Radio>
          <Radio value="d3">最近7天</Radio>
          <Radio value="d4">最近30天</Radio>
          <Radio value="d5">本月</Radio>
          <Radio value="d6">本年</Radio>
        </RadioGroup>
        <RangePicker
          style={{ width: 360, margin: '0 24px 24px 0' }}
          showTime={{
            defaultValue: ['00:00', '04:05'],
            format: 'HH:mm',
          }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
          onSelect={onSelect}
          onOk={onOk}
        />
      </Row>
      <div style={{ width: 550, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 120 }}>关键字：</div>
        <Input placeholder={'请输入名称'}></Input>
        <div style={{ width: 20 }}></div>
        <Button type={'primary'}>添加管理员</Button>
      </div>
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
        onOk={() => setEditPasswordVisible(false)}
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
        />
        <div style={{ height: 20 }} />
        <Input addBefore="确认密码" placeholder="请再次输入密码" />
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
        <Input
          addBefore="管理员姓名"
          placeholder="请输入管理员姓名"
        />
        <div style={{ height: 20 }} />
        <Input
          addBefore="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;帐号"
          placeholder="请输入管理员帐号"
        />
        <div style={{ height: 20 }} />
        <div style={{display:"flex", marginLeft:"20px"}}>
          <div>是否可用:</div>
          <div style={{ width: 20 }} />
          <Switch></Switch>
        </div>
      </Modal>

      <Modal
        title={'提示'}
        visible={deleteVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => setDeleteVisible(false)}
        onCancel={() => setDeleteVisible(false)}
        okText={'确定'}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.warning}></div>确认删除【XXX】管理员吗？
        </div>
      </Modal>
    </Card>
  );
}

export default SearchTable;
