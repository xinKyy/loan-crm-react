import React from 'react';
import { Button, Typography, Badge, Space } from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';
import styles from './style/index.module.less';

const { Text } = Typography;

export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = [
  '过期',
  '待支付',
  '取消订单',
  '匹配中',
  '已支付',
  '完成',
  '收益中',
];

const ContentIcon = [
  <IconText key={0} />,
  <IconHorizontalVideo key={1} />,
  <IconVerticalVideo key={2} />,
];

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string, e: any) => Promise<void>
) {
  return [
    {
      title: '订单编号',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '用户昵称',
      dataIndex: 'userName',
    },
    {
      title: '订单金额',
      dataIndex: 'orderType',
      render: (value, record) => (
        <div>{record.orderType === 1 ? record.offerAmount : record.amount}</div>
      ),
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      render: (value, record) => (
        <div>
          {record.orderType === 1 ? 'PH（提供帮助）' : 'PH（获得帮助）'}
        </div>
      ),
    },
    // {
    //   title: '提供帮助人',
    //   dataIndex: 'orderType',
    //   render: (value, record) => (<div>{record.orderType === 1 ? "PH（提供帮助）" : "PH（获得帮助）"}</div>),
    // },
    // {
    //   title: '得到帮助人',
    //   dataIndex: 'orderType',
    //   render: (value, record) => (<div>{record.orderType === 1 ? "PH（提供帮助）" : "PH（获得帮助）"}</div>),
    // },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: (x) => <div>{Status[x + 1]}</div>,
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
            onClick={(e) => callback(record, 'details', e)}
          >
            订单详情
          </Button>
          <Button
            type="text"
            size="small"
            onClick={(e) => callback(record, 'remarks', e)}
          >
            订单备注
          </Button>
          {record.status === 2 && record.orderType !== 1 ? (
            <Button
              type="text"
              size="small"
              onClick={(e) => callback(record, 'match', e)}
            >
              匹配
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];
}

export default () => ContentIcon;
