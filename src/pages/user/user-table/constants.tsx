import React from 'react';
import {
  Button,
  Typography,
  Badge,
  Space,
  Dropdown,
  Menu,
  Image,
  Statistic,
} from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';
import styles from './style/index.module.less';
import { IconDown } from '@arco-design/web-react/icon';
import { number } from 'prop-types';

const { Text } = Typography;

export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['普通会员', '钻石', '大使', '总裁'];
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
  const onItemClick = (record, page, e) => {
    if (e) e.stopPropagation();
    callback(record, page, e);
  };

  return [
    {
      title: 'ID',
      dataIndex: 'Id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '头像',
      dataIndex: 'Avatar',
      render: (value) => <Image width={50} height={50} src={value}></Image>,
    },
    {
      title: '昵称',
      dataIndex: 'UserName',
    },
    {
      title: '有效会员',
      dataIndex: 'IsMember',
    },
    {
      title: '会员等级',
      dataIndex: 'MemberLevel',
      render: (value) => FilterType[value],
    },
    {
      title: '推荐人',
      dataIndex: 'ParentId',
    },
    {
      title: 'USDT余额',
      dataIndex: 'Usdtbalance',
      render: (v) => <div>{v.split('.')[0]}</div>,
    },
    {
      title: '当前可用CC',
      dataIndex: 'Ccbalance',
      render: (v) => <div>{v.split('.')[0]}</div>,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '40px' },
      render: (_, record) => {
        const dropList = (
          <Menu>
            <Menu.Item
              onClick={(e) => onItemClick(record, 'deposit', e)}
              key="1"
            >
              充值CC基金
            </Menu.Item>
            <Menu.Item
              onClick={(e) => onItemClick(record, 'editPassword', e)}
              key="2"
            >
              修改登录密码
            </Menu.Item>
          </Menu>
        );
        return (
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
        );
      },
    },
  ];
}

export default () => ContentIcon;
