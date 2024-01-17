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
import WalletAddress from '@/components/WalletAddress';

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
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '用户昵称',
      dataIndex: 'account',
    },
    {
      title: '邮箱号',
      dataIndex: 'email',
    },
    {
      title: '收款地址',
      dataIndex: 'address',
      render: (_) => <WalletAddress address={_}></WalletAddress>,
    },
    {
      title: '账户可提现',
      dataIndex: 'withdrawableUsdt',
      render: (_, record) => {
        return (
          <div style={{ fontSize: '12px' }}>
            <div>USDT: {record.withdrawableUsdt}</div>
            <div>&nbsp;&nbsp;AIS: {record.withdrawableAis}</div>
          </div>
        );
      },
    },
    {
      title: '账户不可提现USDT',
      dataIndex: 'frezzUsdt',
    },
    {
      title: '总业绩USDT',
      dataIndex: 'Usdtbalance',
      // render: (v) => <div>{v.split('.')[0]}</div>,
      render: (_, record) => {
        return (
          <div style={{ fontSize: '12px' }}>
            <div>A: {record.partAtotal}</div>
            <div>B: {record.partBtotal}</div>
          </div>
        );
      },
    },
    {
      title: '可对碰折合',
      dataIndex: 'crushSurplusA',
      render: (_, record) => {
        return (
          <div style={{ fontSize: '12px' }}>
            <div>A: {record.crushSurplusA}</div>
            <div>B: {record.crushSurplusB}</div>
          </div>
        );
      },
      // render: (v) => <div>{v.split('.')[0]}</div>,
    },
    {
      title: '是否绑定区域',
      dataIndex: 'partitions',
      render: (v) => <div>{v ? '是' : '否'}</div>,
    },
    {
      title: '所在区',
      dataIndex: 'partitions',
      // render: (v) => <div>{v.split('.')[0]}</div>,
    },
    {
      title: '操作',
      render: (_, record) => {
        const dropList = (
          <Menu>
            <Menu.Item
              onClick={(e) => onItemClick(record, 'deposit', e)}
              key="1"
            >
              充值USDT
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
              onClick={(e) => onItemClick(record, 'edit', e)}
            >
              编辑用户
            </Button>
            <Button
              type="text"
              size="small"
              onClick={(e) => onItemClick(record, 'deposit', e)}
            >
              充值USDT
            </Button>
            <Button
              type="text"
              size="small"
              onClick={(e) => onItemClick(record, 'depositAIS', e)}
            >
              充值AIS
            </Button>
          </Space>
        );
      },
    },
  ];
}

export default () => ContentIcon;
