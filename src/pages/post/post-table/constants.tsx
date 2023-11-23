import React from 'react';
import {
  Button,
  Typography,
  Badge,
  Space,
  Dropdown,
  Menu,
  Image,
  Switch,
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

  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '文章图片',
      dataIndex: 'image',
      render: (value) => <Image width={100} height={100} src={value}></Image>,
    },
    {
      title: '文章标题',
      dataIndex: 'noticeTitle',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
    },
    {
      title: '推送',
      dataIndex: 'status',
      render: (x, record) => (
        <Switch
          onClick={(e) => callback(record, 'change', e)}
          checked={x === 1}
        />
      ),
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
}

export default () => ContentIcon;
