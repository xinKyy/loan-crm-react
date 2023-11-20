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
export const Status = ['未上线', '已上线'];

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
      dataIndex: 'name',
    },
    {
      title: '订单金额',
      dataIndex: 'contentType',
      render: (value) => (
        <div className={styles['content-type']}>
          {ContentIcon[value]}
          {ContentType[value]}
        </div>
      ),
    },
    {
      title: '订单类型',
      dataIndex: 'filterType',
      render: (value) => FilterType[value],
    },
    {
      title: t['searchTable.columns.createdTime'],
      dataIndex: 'createdTime',
      render: (x) => dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => b.createdTime - a.createdTime,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: (x) => {
        if (x === 0) {
          return <Badge status="error" text={Status[x]}></Badge>;
        }
        return <Badge status="success" text={Status[x]}></Badge>;
      },
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
          <Button
            type="text"
            size="small"
            onClick={(e) => callback(record, 'accept', e)}
          >
            匹配
          </Button>
        </Space>
      ),
    },
  ];
}

export default () => ContentIcon;
