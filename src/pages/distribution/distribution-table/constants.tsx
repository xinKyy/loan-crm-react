import React from 'react';
import {
  Button,
  Typography,
  Badge,
  Space,
  Dropdown,
  Menu,
} from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';
import styles from './style/index.module.less';
import { IconDown } from '@arco-design/web-react/icon';

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
  const onItemClick = (page, e) => {
    if (e) e.stopPropagation();
    callback({}, page, e);
  };

  const dropList = (
    <Menu>
      <Menu.Item onClick={(e) => onItemClick('deposit', e)} key="1">
        充值CC基金
      </Menu.Item>
      <Menu.Item onClick={(e) => onItemClick('editPassword', e)} key="2">
        修改登录密码
      </Menu.Item>
    </Menu>
  );

  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '头像',
      dataIndex: 'name',
    },
    {
      title: '昵称',
      dataIndex: 'contentType',
      render: (value) => (
        <div className={styles['content-type']}>
          {ContentIcon[value]}
          {ContentType[value]}
        </div>
      ),
    },
    {
      title: '有效会员',
      dataIndex: 'filterType',
      render: (value) => FilterType[value],
    },
    {
      title: '会员等级',
      dataIndex: 'filterType',
      render: (value) => FilterType[value],
    },
    {
      title: '推荐人',
      dataIndex: 'status',
      render: (x) => {
        if (x === 0) {
          return <Badge status="error" text={Status[x]}></Badge>;
        }
        return <Badge status="success" text={Status[x]}></Badge>;
      },
    },
    {
      title: 'USDT余额',
      dataIndex: 'status',
      render: (x) => {
        if (x === 0) {
          return <Badge status="error" text={Status[x]}></Badge>;
        }
        return <Badge status="success" text={Status[x]}></Badge>;
      },
    },
    {
      title: '直推订单数量',
      dataIndex: 'name',
    },
    {
      title: '直推订单金额',
      dataIndex: 'name',
    },
    {
      title: '佣金金额',
      dataIndex: 'name',
    },
    {
      title: '已得到金额',
      dataIndex: 'name',
    },
    {
      title: '得到次数',
      dataIndex: 'name',
    },
    {
      title: '剩余得到金额',
      dataIndex: 'name',
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
          <Dropdown droplist={dropList} position="bl">
            <Button
              type="text"
              size="small"
              onClick={(e) => e.stopPropagation()}
            >
              更多 <IconDown />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];
}

export default () => ContentIcon;
