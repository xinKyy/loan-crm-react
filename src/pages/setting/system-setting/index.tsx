import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Message,
  Modal,
  Space,
  Switch,
  Table,
  Tabs,
  Upload,
} from '@arco-design/web-react';
import styles from './index.module.less';
import { ContentType, FilterType } from '@/pages/post/post-table/constants';
import {
  APIChangStatePost,
  APICreateBanner,
  APIGetBannerList,
  APIPostList,
} from '@/api/api';
const TabPane = Tabs.TabPane;
const { useForm } = Form;
function Configuration() {
  const bannerColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '轮播图名称',
      dataIndex: 'bannerName',
    },
    {
      title: '轮播图',
      dataIndex: 'image',
      render: (value) => <Image width={50} height={50} src={value}></Image>,
    },
    {
      title: '跳转链接',
      dataIndex: 'noticeTitle',
    },
    {
      title: '添加时间',
      dataIndex: 'noticeTitle',
    },
    {
      title: '是否显示',
      dataIndex: 'status',
      render: (v, record) => (
        <Switch
          onClick={() => changePostStatus(record)}
          checked={v === 1}
        ></Switch>
      ),
    },
    {
      title: '操作',
      dataIndex: 'opt',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            onClick={(e) => callback(record, 'edit', e)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            onClick={(e) => callback(record, 'delete', e)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const [loading, setLoading] = useState(false);
  const [formParams, setFormParams] = useState({});
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [createBannerModal, setCreateBannerModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [currentRecord, setCurrentRecord]: any = useState();
  const [form] = useForm();

  const callback = (record, type, e) => {
    e.stopPropagation();
    if (!currentRecord || record.id !== currentRecord?.id) {
      setCurrentRecord(record);
    }
    if (type === 'edit') {
      setEdit(true);
      setSelectedRowKeys([record.jumpUrl]);
      form.setFieldsValue({
        ...record,
        status: record.status === 1,
      });
      setCreateBannerModal(true);
    }
    if (type === 'delete') {
      setDeleteVisible(true);
    }
  };

  const getBannerList = () => {
    APIGetBannerList({}).then((resp: any) => {
      if (resp.result) {
        setData(resp.result);
      }
    });
  };

  useEffect(() => {
    getBannerList();
    getPostList();
  }, []);

  const onChange = (files) => {
    if (files && files[0].status === 'done') {
      form.setFieldsValue({
        ...form.getFieldsValue(),
        image: files[0].response.result.url,
      });
    }
  };

  const getPostList = () => {
    setLoading(true);
    APIPostList({})
      .then((resp: any) => {
        setPostData(resp.result);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createBanner = () => {
    setCreateBannerModal(false);
    setLoading(true);
    const params = form.getFieldsValue();
    APICreateBanner({
      id: edit ? currentRecord.id : null,
      bannerName: params.bannerName,
      image: params.image,
      jumpUrl: `${selectedRowKeys[0]}`,
      status: params.status ? '1' : '0',
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success(`${edit ? '修改' : '发布'}轮播图成功！`);
          getBannerList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const changePostStatus = (record, deleteStatus?) => {
    setLoading(true);
    setDeleteVisible(false);
    APICreateBanner({
      id: record.id,
      status: deleteStatus ?? (record.status === 1 ? 0 : 1),
    })
      .then((resp: any) => {
        if (resp.result) {
          deleteStatus
            ? Message.info('删除文章成功！')
            : Message.info('修改状态成功！');
          getBannerList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card style={{ height: '75vh' }} className={styles.page_modal}>
      <Tabs defaultActiveTab="1">
        <TabPane key="1" title="轮播图设置">
          <div style={{ height: 20 }} />
          <div style={{ width: 700, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 20 }}></div>
            <div style={{ width: 120 }}>轮播图标题：</div>
            <Input style={{ width: 500 }} placeholder={'请输入名称'}></Input>
            <div style={{ width: 20 }}></div>
            <Button
              type={'primary'}
              onClick={() => {
                setEdit(false);
                setCreateBannerModal(true);
              }}
            >
              添加轮播图
            </Button>
          </div>

          <div style={{ height: 20 }} />
          <Table
            rowKey="id"
            loading={loading}
            columns={bannerColumns}
            data={data}
          />
        </TabPane>

        <TabPane key="2" title="交易设置">
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>订单自动关闭时间</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>订单提交后待支付时长</div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>系统匹配时间</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>订单提交后待匹配时长</div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>佣金冻结周期</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                冻结期从用户获得返佣时(确认收货后)开始计算，如设置5天，即确认收货5天后，佣金解冻可提现；如设置0天，则无冻结期
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title="创建轮播图"
        visible={createBannerModal}
        onOk={() => createBanner()}
        onCancel={() => setCreateBannerModal(false)}
        okText={'确定'}
        hideCancel={true}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={form}>
          <Form.Item label={'轮播图名称'} field={'bannerName'}>
            <Input placeholder={'请输入轮播图名称'}></Input>
          </Form.Item>
          <Form.Item label={'轮播图'} field={'image'}>
            <div>
              <Upload
                listType="picture-card"
                accept={'.png,.jpg,.jpeg,.webp'}
                limit={1}
                onChange={onChange}
                action="/api/upload/uploadPicUrl"
              />
            </div>
          </Form.Item>
          <Form.Item label={'跳转链接'} field={'jumpUrl'}>
            <Button onClick={() => setPostModal(true)}>
              {selectedRowKeys
                ? `https://${selectedRowKeys[0]}`
                : '选择跳转链接'}
            </Button>
          </Form.Item>
          <Form.Item label={'是否显示'} field={'status'}>
            <Switch></Switch>
          </Form.Item>
        </Form>
      </Modal>

      <div className={styles.page_modal}>
        <Modal
          title="选择文章跳转"
          visible={postModal}
          onOk={() => setPostModal(false)}
          onCancel={() => setPostModal(false)}
          okText={'确定'}
          hideCancel={true}
          autoFocus={false}
          focusLock={true}
        >
          <Table
            rowKey="id"
            columns={columns}
            data={postData}
            rowSelection={{
              type: 'radio',
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
          />
        </Modal>

        <Modal
          title={'提示'}
          visible={deleteVisible}
          wrapClassName={styles.table_modal_wrap}
          onOk={() => changePostStatus(currentRecord, 3)}
          onCancel={() => setDeleteVisible(false)}
          okText={'确定'}
          autoFocus={false}
          focusLock={true}
        >
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.warning}></div>确认删除【
            {currentRecord?.bannerName}】吗？
          </div>
        </Modal>
      </div>
    </Card>
  );
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '文章图片',
    dataIndex: 'image',
    render: (value) => <Image width={50} height={50} src={value}></Image>,
  },
  {
    title: '文章标题',
    dataIndex: 'noticeTitle',
  },
];

export default Configuration;
