import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
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
  Message,
  Card,
  Image,
  Descriptions, Upload, Divider,
} from '@arco-design/web-react';
import { GlobalContext } from '@/context';
import useLocale from '@/utils/useLocale';
import { IconDown, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './index.module.less';
import { getStartOfDay, splitWalletAddress } from '@/utils/dateUtil';
import {
  APIConfirmQuestion,
  APIConfirmWithdraw,
  APIGetChargeRecord, APIGetFeedbackList,
} from '@/api/api';
import { withDrawUSDT } from '@/utils/web3Util';
import {Log} from "@antv/scale";
const { RangePicker } = DatePicker;
const { useForm } = Form;
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;
const orderTypeList = ['得到帮助', '提供帮助', '全部'];
function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  function onSelect(dateString, date) {
    console.log('onSelect', dateString, date);
  }

  function onChange(dateString, date) {
    console.log('onChange: ', dateString, date);
  }

  function onOk(dateString, date) {
    console.log('onOk: ', dateString, date);
  }

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item  label={'意见类型:'} field="feedbackType">
              <RadioGroup
                  type="button"
                  name="lang"
              >
                <Radio value="Credit limit">Credit limit</Radio>
                <Radio value="Fee">Fee</Radio>
                <Radio value="Bank card">Bank card</Radio>
                <Radio value="Loanreview">Loanreview</Radio>
                <Radio value="Repayment">Repayment</Radio>
                <Radio value="Overdue">Overdue</Radio>
                <Radio value="Page & Process Copywriting">Page & Process Copywriting</Radio>
                <Radio value="other problems">other problems</Radio>
              </RadioGroup>
            </Form.Item>
          </Col>
          <Form.Item label={'意见人联系方式:'} field="contactInfo">
            <Input style={{width:300}} placeholder="请输入意见人联系方式" />
          </Form.Item>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          搜索
        </Button>
        <div style={{height:"20px"}}></div>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}


const ImageGroup = ({srcList, }) =>{

  const [visible, setVisible] = useState(false)

  return <>
    <Image width={100} height={100} preview={false} onClick={()=>setVisible(true)} src={srcList[0]}></Image>
    <Image.PreviewGroup  srcList={srcList} visible={visible} onVisibleChange={setVisible} />
  </>
}

const columns = (callback) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    // {
    //   title: '头像',
    //   dataIndex: 'account',
    // },
    {
      title: '意见人联系方式',
      dataIndex: 'contactInfo',
    },
    // {
    //   title: '有效会员',
    //   dataIndex: 'amount',
    // },
    {
      title: '反馈内容',
      dataIndex: 'content',
    },
    {
      title: '意见类型',
      dataIndex: 'feedbackType',
    },
  ];
};

const WithdrawComponents = () => {
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    total: 0,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [formParams, setFormParams] = useState({});
  const [data, setData] = useState([]);
  const [recordData, setRecordData] = useState([]);
  const [reviewRecordData, setReviewRecordData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [reviewQuestionVisible, setReviewQuestionVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentConfirmRecord, setCurrentConfirmRecord]: any = useState();
  const [expandData, setExpandData] = useState([
    {
      label: '私钥:',
      value: 'Socrates',
    },
    {
      label: '收款地址:',
      value: '123-1234-1234',
    },
  ]);

  const [form] = useForm();

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const callBack = (record, type) => {
    setCurrentConfirmRecord(record);
    setRecordData([
      {
        label: '用户ID',
        value: record.id,
      },
      {
        label: '用户昵称',
        value: record.nickName,
      },
      {
        label: '邮箱号码',
        value: record.email,
      },
      {
        label: '手机号码',
        value: record.phone,
      },
      {
        label: '反馈和意见',
        value: record.question,
      },
      {
        label: '附件图片',
        value:  <ImageGroup srcList={record.image.split("|")}></ImageGroup>,
      },
    ]);

    setReviewRecordData([
      {
        label: '回复内容',
        value: record.recall,
      },
      {
        label: '附件图片',
        value:  record?.recallImage != null ? <ImageGroup srcList={record?.recallImage?.split("|")}></ImageGroup> : "无",
      },
    ]);

    if(type === "show_review"){
      setReviewQuestionVisible(true);
    } else {
      setQuestionVisible(true);
    }

  };

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  useEffect(() => {
    getData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  const getData = () => {
    setLoading(true);
    APIGetFeedbackList(
      {
        ...formParams,
        size: pagination.pageSize,
        number: pagination.current,
      },
    ).then((resp: any) => {
      if (resp.data) {
        setData(resp.data.content);
        setPatination({
          ...pagination,
          total: resp.data.totalElements,
        });
      }
    }).finally(()=>{
      setLoading(false);
    });
  };

  const confirmQuestion = (type) => {
    setQuestionVisible(false);
    setLoading(true);

    // if (type === -1) {
    //   APICheckFeedback({
    //     id: currentConfirmRecord?.id,
    //     type: type,
    //   })
    //     .then((resp: any) => {
    //       if (resp.result) {
    //         Message.success('已拒绝');
    //         getData();
    //       }
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // } else {
    //   APICheckFeedback({
    //     id: currentConfirmRecord?.id,
    //     type: type,
    //     ...form.getFieldsValue()
    //   })
    //       .then((resp: any) => {
    //         if (resp.result) {
    //           Message.success('已回复');
    //           getData();
    //         }
    //       })
    //       .finally(() => {
    //         setLoading(false);
    //         setReviewVisible(false);
    //       });
    // }
  };

  const onChange = (files) => {
    if (files && files[0].status === 'done') {
      form.setFieldValue("images", files[0].response.result.url)
    }
  };

  return (
    <Card>
      <div>
        {
           <SearchForm onSearch={handleSearch}></SearchForm>
        }
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns(callBack)}
          data={data}
        />

        <Modal
          title="处理反馈 "
          visible={questionVisible}
          onCancel={() => setQuestionVisible(false)}
          hideCancel
          autoFocus={false}
          focusLock={true}
          footer={
            <>
              <Button onClick={() => setReviewVisible(true)} type={'primary'}>
                回复
              </Button>
              <Button onClick={() => confirmQuestion(-1)} type={'primary'}>
                废弃
              </Button>
            </>
          }
        >

          <Descriptions
              column={1}
              data={recordData}
              style={{ marginBottom: 20 }}
              labelStyle={{ paddingRight: 36 }}
          />
        </Modal>

        <Modal
            title="处理结果 "
            visible={reviewQuestionVisible}
            onCancel={() => setReviewQuestionVisible(false)}
            hideCancel
            autoFocus={false}
            focusLock={true}
            footer={
              <>
                <Button onClick={() => setReviewQuestionVisible(false)} type={'primary'}>
                  确定
                </Button>
              </>
            }
        >

          <Descriptions
              column={1}
              data={recordData}
              style={{ marginBottom: 20 }}
              labelStyle={{ paddingRight: 36 }}
          />

          <Divider></Divider>

          <Descriptions
              column={1}
              data={reviewRecordData}
              style={{ marginBottom: 20 }}
              labelStyle={{ paddingRight: 36 }}
          />
        </Modal>


        <Modal
            title="回复反馈 "
            visible={reviewVisible}
            onCancel={() => setReviewVisible(false)}
            hideCancel
            autoFocus={false}
            focusLock={true}
            footer={
              <>
                <Button onClick={() => confirmQuestion(1)} type={'primary'}>
                  确认
                </Button>
              </>
            }
        >
          <Form form={form}>
            <Form.Item required label={"回复"} rules={[{required: true}]} field={"recall"}>
              <Input.TextArea placeholder={"回复信息"}  autoSize={{
                minRows:5,
              }} >

              </Input.TextArea>
            </Form.Item>

            <Form.Item label={"附件"} rules={[{required: true}]} field={"images"}>
              <div>
                <Upload
                    listType="picture-card"
                    accept={'.png,.jpg,.jpeg,.webp'}
                    limit={1}
                    onChange={onChange}
                    action="/api/api/v1/common/uploadPicUrl"
                />
              </div>
            </Form.Item>

          </Form>

        </Modal>
      </div>
    </Card>
  );
};

export default WithdrawComponents;
