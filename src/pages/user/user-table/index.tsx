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
  Switch,
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
  APIChangeUserStatus,
  APIEditUser,
  APIEditUserCCBalance,
  APIEditUserPassword,
  APIGetUserList,
  APIGetUsersList,
} from '@/api/api';

const Row = Grid.Row;
const Col = Grid.Col;

const { Title } = Typography;
export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const Status = ['已上线', '未上线'];
const RadioGroup = Radio.Group;
export const FilterType = ['普通会员', '钻石', '大使', '总裁'];
const { useForm } = Form;

function SearchTable() {
  const t = useLocale(locale);

  const [currentRecord, setCurrentRecord]: any = useState();
  const tableCallback = async (record, type, e) => {
    if (e) e.stopPropagation();
    setCurrentRecord(record);
    if (type === 'edit') {
      openModal();
    }
    if (type === 'deposit') {
      setDepositVisible(true);
    }
    if (type === 'depositAIS') {
      setDepositAISVisible(true);
    }
    if (type === 'editPassword') {
      setEditPasswordVisible(true);
    }
  };

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
  const [depositAISVisible, setDepositAISVisible] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  const [form] = useForm();
  const [passForm] = useForm();
  const [depositForm] = useForm();
  const columns = useMemo(
    () => getColumns(t, tableCallback),
    [currentRecord, modalVisible]
  );

  useEffect(() => {
    // fetchData();
    getUserList();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

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
    form.resetFields();
    setModalVisible(false);
  };

  const getUserList = () => {
    setLoading(true);
    APIGetUsersList({
      ...formParams,
      page_num: pagination.current,
      page_size: pagination.pageSize,
    })
      .then((resp: any) => {
        if (resp.result) {
          setData(resp.result.records);
          setPatination({
            ...pagination,
            total: resp.result.total,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clickMenu = (v) => {
    setCurrentRecord({
      ...currentRecord,
      MemberLevel: v,
    });
  };

  const dropList = (
    <Menu>
      <Menu.Item onClick={() => clickMenu(0)} key="0">
        普通会员
      </Menu.Item>
      <Menu.Item onClick={() => clickMenu(1)} key="1">
        钻石
      </Menu.Item>
      <Menu.Item onClick={() => clickMenu(2)} key="2">
        大使
      </Menu.Item>
      <Menu.Item onClick={() => clickMenu(3)} key="3">
        总裁
      </Menu.Item>
    </Menu>
  );

  const editUser = () => {
    setModalVisible(false);
    setLoading(true);
    APIEditUser({
      ...form.getFieldsValue(),
      membershiplevel: currentRecord?.MemberLevel,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('修改用户成功！');
          getUserList();
        }
      })
      .finally(() => {
        form.resetFields();
        setLoading(false);
      });
  };

  const editUserPassword = () => {
    const params = passForm.getFieldsValue();
    if (params.pass !== params.rePassword) {
      return Message.error('两次密码必须一致！');
    }
    setEditPasswordVisible(false);
    setLoading(true);
    APIEditUserPassword({
      ...passForm.getFieldsValue(),
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('修改用户密码成功！');
        }
      })
      .finally(() => {
        passForm.resetFields();
        setLoading(false);
      });
  };

  const depositUserBalance = (coin) => {
    if (coin === 0) {
      setDepositVisible(false);
    } else {
      setDepositAISVisible(false);
    }
    setLoading(true);
    APIEditUserCCBalance({
      ...depositForm.getFieldsValue(),
      coin: coin,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('修改用户余额成功！');
          getUserList();
        }
      })
      .finally(() => {
        depositForm.resetFields();
        setLoading(false);
      });
  };

  const changeUserStatus = (record) => {
    setLoading(true);
    APIChangeUserStatus({
      userId: record.id,
      status: record.status === 1 ? 0 : 1,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('操作成功！');
          getUserList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card>
      <SearchForm onSearch={handleSearch} />
      <Table
        rowKey="id"
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
                    <span>推荐人：</span>
                    {record?.prentAccount}
                  </div>
                  <div>
                    <span>接点人：</span>
                    {record?.contractAccount}
                  </div>
                  <div>
                    <span>状态：</span>
                    <Switch
                      onChange={(v) => changeUserStatus(record)}
                      checked={record.status === 1}
                    ></Switch>
                  </div>
                  <div>
                    <span>创建时间：</span>
                    {record?.createTime}
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

      {modalVisible ? (
        <Modal
          title={
            <span style={{ fontWeight: 'bold', textAlign: 'left' }}>编辑</span>
          }
          unmountOnExit={true}
          visible={modalVisible}
          wrapClassName={styles.table_modal_wrap}
          onOk={() => editUser()}
          onCancel={() => cancelModal()}
          okText={'确定'}
          hideCancel={true}
          autoFocus={false}
          focusLock={true}
        >
          <Form form={form}>
            <Form.Item
              label={'ID'}
              initialValue={currentRecord?.Id}
              field={'userId'}
            >
              <Input disabled />
            </Form.Item>
            <div style={{ height: 20 }} />
            <Form.Item
              label={'邮箱号'}
              initialValue={currentRecord?.Email}
              field={'email'}
            >
              <Input placeholder="请输入邮箱号" />
            </Form.Item>
            <div style={{ height: 20 }} />
            <Form.Item
              label={'备注'}
              initialValue={currentRecord?.Remark}
              field={'remark'}
            >
              <Input.TextArea placeholder="请输入备注" />
            </Form.Item>
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex' }}>
              <Form.Item
                label={'状态'}
                initialValue={currentRecord?.status}
                field={'status'}
              >
                <RadioGroup defaultValue={currentRecord?.status}>
                  <Radio value="0">开启</Radio>
                  <Radio value="1">关闭</Radio>
                </RadioGroup>
              </Form.Item>
            </div>
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item label={'会员等级'} field={'membershiplevel'}>
                <Dropdown droplist={dropList} position="br">
                  <Button type="default">
                    {FilterType[currentRecord?.MemberLevel]}
                    <IconDown />
                  </Button>
                </Dropdown>
              </Form.Item>
            </div>
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item label={'上级推广员'} field={'parentid'}>
                <Input placeholder={'请输入上级的Email'}></Input>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      ) : null}

      <Modal
        title={'修改用户USDT不可提现'}
        visible={depositVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => depositUserBalance(0)}
        onCancel={() => {
          depositForm.resetFields();
          setDepositVisible(false);
        }}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={depositForm}>
          <div style={{ height: 20 }} />
          <Form.Item
            label={'ID'}
            initialValue={currentRecord?.id}
            field={'userId'}
          >
            <Input disabled />
          </Form.Item>
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex' }}>
            <Form.Item label={'修改USDT'} initialValue={'0'} field={'type'}>
              <RadioGroup defaultValue="1">
                <Radio value="1">增加</Radio>
                <Radio value="-1">减少</Radio>
              </RadioGroup>
            </Form.Item>
          </div>
          <div style={{ height: 20 }} />
          <Form.Item initialValue={0} label={'USDT不可提现'} field={'amount'}>
            <InputNumber
              mode="button"
              defaultValue={500}
              style={{ width: '150px' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={'修改用户AIS余额'}
        visible={depositAISVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => depositUserBalance(1)}
        onCancel={() => {
          depositForm.resetFields();
          setDepositAISVisible(false);
        }}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={depositForm}>
          <div style={{ height: 20 }} />
          <Form.Item
            label={'ID'}
            initialValue={currentRecord?.id}
            field={'userId'}
          >
            <Input disabled />
          </Form.Item>
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex' }}>
            <Form.Item label={'修改AIS'} initialValue={'0'} field={'type'}>
              <RadioGroup defaultValue="1">
                <Radio value="1">增加</Radio>
                <Radio value="-1">减少</Radio>
              </RadioGroup>
            </Form.Item>
          </div>
          <div style={{ height: 20 }} />
          <Form.Item initialValue={0} label={'AIS数量'} field={'amount'}>
            <InputNumber
              mode="button"
              defaultValue={500}
              style={{ width: '150px' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={'修改用户密码'}
        visible={editPasswordVisible}
        wrapClassName={styles.table_modal_wrap}
        onOk={() => {
          editUserPassword();
        }}
        onCancel={() => {
          passForm.resetFields();
          setEditPasswordVisible(false);
        }}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={passForm}>
          <div style={{ height: 20 }} />
          <Form.Item
            label={'ID'}
            initialValue={currentRecord?.Id}
            field={'userId'}
          >
            <Input disabled />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item label={'密码'} field={'pass'}>
            <Input.Password
              value={currentRecord?.Id}
              placeholder="请输入密码"
            />
          </Form.Item>
          <div style={{ height: 20 }} />
          <Form.Item label={'确认密码'} field={'rePassword'}>
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        </Form>
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
