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
    if (type === 'edit') {
      openModal();
    }
    if (type === 'delete') {
      setDeleteVisible(true);
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

  return (
    <Card>
      <div style={{ width: 550, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 120 }}>等级名称：</div>
        <Input placeholder={'请输入名称'}></Input>
        <div style={{ width: 20 }}></div>
        <Button type={'primary'}>添加分销等级</Button>
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
        title={
          <span style={{ fontWeight: 'bold', textAlign: 'left' }}>
            添加分销员等级
          </span>
        }
        visible={modalVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => setModalVisible(false)}
        onCancel={() => cancelModal()}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <Input addBefore="等级名称" placeholder="请输入等级名称" />
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12 }} />
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
            <span style={{ color: '#ff0000' }}>*</span>等级:
          </div>
          <div style={{ width: 20 }} />
          <InputNumber
            mode="button"
            defaultValue={500}
            style={{ width: 160 }}
          />
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12 }} />
          <div>
            <span style={{ color: '#ff0000' }}>*</span>直推人数:
          </div>
          <div style={{ width: 20 }} />
          <InputNumber
            mode="button"
            defaultValue={500}
            style={{ width: 160 }}
          />
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12 }} />
          <div>
            <span style={{ color: '#ff0000' }}>*</span>团队人数:
          </div>
          <div style={{ width: 20 }} />
          <InputNumber
            mode="button"
            defaultValue={500}
            style={{ width: 160 }}
          />
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex' }}>
          <div
            style={{
              padding: '0 12px',
              height: '32px',
              background: '#F2F3F5',
              lineHeight: '32px',
            }}
          >
            收益描述：
          </div>
          <div style={{ width: 1, height: 32, background: '#E5E6EC' }}></div>
          <div style={{ flex: '1' }}>
            {' '}
            <Input.TextArea placeholder="请输入备注" />
          </div>
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
          <div className={styles.warning}></div>确认删除【普通会员】分销等级吗？
        </div>
      </Modal>
    </Card>
  );
}

const orderColumns: TableColumnProps[] = [
  {
    title: '订单编号',
    dataIndex: 'name',
  },
  {
    title: '操作记录',
    dataIndex: 'salary',
  },
  {
    title: '操作时间',
    dataIndex: 'address',
  },
  {
    title: '操作角色',
    dataIndex: 'email',
  },
];
const mateColumns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'name',
  },
  {
    title: '订单金额',
    dataIndex: 'salary',
  },
  {
    title: '订单编号',
    dataIndex: 'address',
  },
  {
    title: '账户来源',
    dataIndex: 'email',
  },
  {
    title: '匹配剩余时间',
    dataIndex: 'email',
  },
];

const orderData = [
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com',
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com',
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    salary: 22000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com',
  },
  {
    key: '4',
    name: 'Ed Hellen',
    salary: 17000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com',
  },
  {
    key: '5',
    name: 'William Smith',
    salary: 27000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com',
  },
];

export default SearchTable;
