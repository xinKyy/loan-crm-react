import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  Input,
  InputNumber,
  Space,
  Switch,
  Table,
  Tabs,
} from '@arco-design/web-react';
import styles from './index.module.less';
import { ContentType, FilterType } from '@/pages/post/post-table/constants';
const TabPane = Tabs.TabPane;

function Configuration() {
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const [data, setData] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '轮播图名称',
      dataIndex: 'name',
    },
    {
      title: '轮播图',
      dataIndex: 'contentType',
    },
    {
      title: '跳转链接',
      dataIndex: 'filterType',
    },
    {
      title: '创建时间',
      dataIndex: 'filterType',
    },
    {
      title: '是否显示',
      dataIndex: 'filterType',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '40px' },
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

  const callback = (record, type, e) => {
    e.stopPropagation();
  };

  return (
    <Card style={{ height: '75vh' }}>
      <Tabs defaultActiveTab="1">
        <TabPane key="1" title="轮播图设置">
          <div style={{ height: 20 }} />
          <div style={{ width: 700, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 20 }}></div>
            <div style={{ width: 120 }}>轮播图标题：</div>
            <Input style={{ width: 500 }} placeholder={'请输入名称'}></Input>
            <div style={{ width: 20 }}></div>
            <Button type={'primary'}>添加轮播图</Button>
          </div>

          <div style={{ height: 20 }} />
          <Table rowKey="id" loading={loading} columns={columns} data={data} />
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
    </Card>
  );
}

export default Configuration;
