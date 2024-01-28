import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Grid,
  Radio,
  Space,
  Dropdown,
  Menu,
  PaginationProps,
  Table,
  Modal,
  Message, Card,
} from '@arco-design/web-react';
import { IconDown, IconRefresh, IconSearch, IconInfoCircle } from '@arco-design/web-react/icon';
import styles from '../../index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import {
  APIConfirmWithdraw,
  APIGetChargeRecord, APIGetLoanOrderCancel, APIGetRepaymentPlanList, APIGetTaskList,
} from '@/api/api';
import { withDrawUSDT } from '@/utils/web3Util';
import ModalAlert from '@/components/ModalAlert';
const { RangePicker } = DatePicker;
const { useForm } = Form;
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;


const getColumns = (callback) => {
  return [
    {
      title: '任务序号',
      dataIndex: 'id',
    },
    {
      title: '功能说明',
      dataIndex: 'des',
    },
    {
      title: '操作',
      dataIndex: 'type',
      render: (_, record) => {
        return (
          <Space>
            <Button type="primary" size="small" onClick={(e) => callback(record)}>
              手动触发
            </Button>
          </Space>
        )
      }
    },
  ];
};

const WorkOrderCheck = () => {
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    total: 0,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [formParams, setFormParams] = useState({});
  const [data, setData] = useState([
    {
      id:1,
      des:"每日还款金额计算",
    },
    {
      id:2,
      des:"向电催公司1推送催收数据",
    },
    {
      id:3,
      des:"向电催公司1推送回款数据",
    },
    {
      id:4,
      des:"推送冲账数据",
    },
    {
      id:5,
      des:"每日金账户金额查询",
    },
    {
      id:6,
      des:"更新虚拟账户还款金额",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [currentConfirmRecord, setCurrentConfirmRecord]: any = useState();
  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = (record) => {
    setCurrentConfirmRecord(record);
    setQuestionVisible(true);
  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  const columns = useMemo(()=>getColumns(callBack), []);


  const confirmQuestion = () => {
    setQuestionVisible(false);
    setLoading(true);
    APIGetLoanOrderCancel({
      type: currentConfirmRecord?.id,
    })
      .then((resp: any) => {
        if (resp.data) {
          Message.success(`已触发【${currentConfirmRecord.des}】定时任务`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card>
      <div>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />


        <ModalAlert
          title={"取消工单"}
          body={<div>
            <IconInfoCircle style={{color:"#ff0000", fontSize:"16px"}} />
            确认触发【{currentConfirmRecord?.des}】定时任务？
          </div>}
          visible={questionVisible}
          onCancel={() => setQuestionVisible(false)}
          refuseFun={() => setQuestionVisible(false)}
          confirmFun={() => confirmQuestion()}
        />
      </div>
    </Card>
  );
};

export default WorkOrderCheck;
