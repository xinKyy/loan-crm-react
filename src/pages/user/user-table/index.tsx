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
  InputNumber, Form,
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
import {APIGetUserList} from "@/api/api";
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
    console.log(record, type);
    if (e) e.stopPropagation();
    if (!currentRecord || record.Id !== currentRecord?.Id) {
      setCurrentRecord(record);
    }
    if (type === 'edit') {
      openModal();
    }
    if (type === 'deposit') {
      setDepositVisible(true);
    }
    if (type === 'editPassword') {
      setEditPasswordVisible(true);
    }
  };
  const [currentRecord, setCurrentRecord]: any = useState();
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

  const [modalVisible, setModalVisible] = useState(false);
  const [depositVisible, setDepositVisible] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);

  useEffect(() => {
    // fetchData();
    getUserList();
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
        console.log('aaa', res);
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

  const getUserList = () => {
    setLoading(true);
    APIGetUserList({
      ...formParams
    }).then((resp:any)=>{
      if(resp.result){
        setData(resp.result);
      }
    }).finally(()=>{
      setLoading(false);
    })
  }

  return (
    <Card>
      <SearchForm onSearch={handleSearch} />
      <Table
        rowKey="Id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
        expandedRowRender={(record) => {
          return (
            <>
              <Col>
                <div className={styles.row}>
                  <div>
                    <span>首次访问：</span>{record?.Create_time}
                  </div>
                  <div>
                    <span>近次访问：</span>{record?.Login_date}
                  </div>
                  <div>
                    <span>备注：</span>{record?.Remark}
                  </div>
                </div>
              </Col>
            </>
          );
        }}
        expandProps={{
          expandRowByClick: true,
          rowExpandable: (record) => true,
        }}
      />

      <Modal
        title={
          <span style={{ fontWeight: 'bold', textAlign: 'left' }}>编辑</span>
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
        <Form>
          <Form.Item label={"ID"} field={"userId"}>
            <Input
              disabled
            />
          </Form.Item>
        <div style={{ height: 20 }} />
          <Form.Item label={"邮箱号"} field={"email"}>
            <Input  placeholder="请输入邮箱号" />
          </Form.Item>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex' }}>
          <Form.Item label={"备注"} field={"remark"}>
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex' }}>
          <Form.Item label={"状态"} field={"status"}>
            <RadioGroup defaultValue="open">
              <Radio value="open">开启</Radio>
              <Radio value="close">关闭</Radio>
            </RadioGroup>
          </Form.Item>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item label={"会员等级"} field={"membershiplevel"}>
            <Dropdown droplist={dropList} position="br">
              <Button type="default">
                普通会员
                <IconDown />
              </Button>
            </Dropdown>
          </Form.Item>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item label={"上级推广员"} field={"parentid"}>
            <Input placeholder={"请输入上级的Email"}>

            </Input>
          </Form.Item>
        </div>
        </Form>
      </Modal>

      <Modal
        title={'修改用户CC基金'}
        visible={depositVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => setDepositVisible(false)}
        onCancel={() => setDepositVisible(false)}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex' }}>
          <div style={{ width: 12 }} />
          <div>
            <span style={{ color: '#ff0000' }}>*</span>修改CC基金:
          </div>
          <div style={{ width: 20 }} />
          <RadioGroup defaultValue="add">
            <Radio value="add">增加</Radio>
            <Radio value="sub">减少</Radio>
          </RadioGroup>
        </div>
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12 }} />
          <div>
            <span style={{ color: '#ff0000' }}>*</span>CC基金:
          </div>
          <div style={{ width: 20 }} />
          <InputNumber
            mode="button"
            defaultValue={500}
            style={{ width: 160, margin: '10px 24px 10px 0' }}
          />
        </div>
      </Modal>

      <Modal
        title={'修改用户密码'}
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
