import React from 'react';
import {
  Button,
  Typography,
  Badge,
  Space,
  Dropdown,
  Menu,
  Switch,
} from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';
import styles from './style/index.module.less';
import { IconDown } from '@arco-design/web-react/icon';
import { splitWalletAddress } from '@/utils/dateUtil';

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

  return [
    {
      title: '账户ID',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '账户名称',
      dataIndex: 'name',
    },
    {
      title: '账户收款地址',
      dataIndex: 'address',
      render: (_, record) => {
        return (
          <a
            target="_blank"
            href={`https://testnet.bscscan.com/tx/${_}`}
            rel="noreferrer"
          >
            {splitWalletAddress(_)}
          </a>
        );
      },
    },
    {
      title: '期初静态余额',
      dataIndex: 'init',
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
            onClick={(e) => callback(record, 'match', e)}
          >
            匹配
          </Button>
          <Button
            type="text"
            size="small"
            onClick={(e) => callback(record, 'details', e)}
          >
            查看匹配记录
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
}

export default () => ContentIcon;
