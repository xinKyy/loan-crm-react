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
export const FilterType = ['普通会员', '钻石会员', "大使", "总裁"];
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
    // {
    //   title: '图标',
    //   dataIndex: 'name',
    // },
    {
      title: '名称',
      dataIndex: 'rankname',
    },
    {
      title: '等级',
      dataIndex: 'rankid',
      render: (value) => FilterType[value],
    },
    {
      title: '收益描述',
      dataIndex: 'incomedescription',
    },
    {
      title: '直推人数',
      dataIndex: 'directnumber',
    },
    {
      title: '团队人数',
      dataIndex: 'groupsize',
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
          {/*<Button*/}
          {/*  type="text"*/}
          {/*  size="small"*/}
          {/*  onClick={(e) => callback(record, 'delete', e)}*/}
          {/*>*/}
          {/*  删除*/}
          {/*</Button>*/}
        </Space>
      ),
    },
  ];
}

export default () => ContentIcon;
