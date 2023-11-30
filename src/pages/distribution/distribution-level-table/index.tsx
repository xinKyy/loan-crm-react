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
import { APIEditVipList, APIGetVipList } from '@/api/api';
const Row = Grid.Row;
const Col = Grid.Col;

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];
const RadioGroup = Radio.Group;
const { useForm } = Form;
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
    if (!currentRecord || record.id !== currentRecord?.id) {
      setCurrentRecord(record);
    }
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
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [formParams, setFormParams] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [currentRecord, setCurrentRecord]: any = useState();
  useEffect(() => {
    getVipList();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const cancelModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const getVipList = () => {
    setLoading(true);
    APIGetVipList({})
      .then((resp: any) => {
        if (resp.result) {
          setData(resp.result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editVipDesc = () => {
    setModalVisible(false);
    setLoading(true);
    APIEditVipList({
      ...form.getFieldsValue(),
      id: currentRecord?.id,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('更新成功！');
          getVipList();
        }
      })
      .finally(() => {
        setLoading(false);
        form.resetFields();
      });
  };

  return (
    <Card>
      {/*<div style={{ width: 550, display: 'flex', alignItems: 'center' }}>*/}
      {/*  <div style={{ width: 120 }}>等级名称：</div>*/}
      {/*  <Input placeholder={'请输入名称'}></Input>*/}
      {/*  <div style={{ width: 20 }}></div>*/}
      {/*  /!*<Button type={'primary'}>添加分销等级</Button>*!/*/}
      {/*</div>*/}
      <div style={{ height: 20 }} />
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />

      {modalVisible ? (
        <Modal
          title={
            <span style={{ fontWeight: 'bold', textAlign: 'left' }}>
              编辑分销员备注
            </span>
          }
          visible={modalVisible}
          wrapClassName={styles.table_modal_wrap}
          onOk={() => editVipDesc()}
          onCancel={() => cancelModal()}
          okText={'确定'}
          hideCancel={true}
          autoFocus={false}
          focusLock={true}
        >
          <Form form={form}>
            <div style={{ height: 20 }} />

            <Form.Item
              label={'等级名称'}
              initialValue={currentRecord?.rankname}
              field={'rankname'}
            >
              <Input placeholder="请输入等级名称" />
            </Form.Item>
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 12 }} />
              <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
                <span style={{ color: '#ff0000' }}>*</span>等级:
              </div>
              <div style={{ width: 20 }} />
              <InputNumber
                disabled
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
                disabled
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
                disabled
                mode="button"
                defaultValue={500}
                style={{ width: 160 }}
              />
            </div>
            <div style={{ height: 20 }} />
            <Form.Item
              label={'备注'}
              initialValue={currentRecord?.incomedescription}
              field={'incomedescription'}
            >
              <Input.TextArea autoSize placeholder="请输入备注" />
            </Form.Item>
            <div style={{ height: 20 }} />
            <Form.Item
              label={'等级描述'}
              initialValue={currentRecord?.viprights}
              field={'viprights'}
            >
              <Input.TextArea autoSize placeholder="请输入等级描述" />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}

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
