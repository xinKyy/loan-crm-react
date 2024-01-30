import {
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Image,
  Input,
  Message,
  PageHeader,
  Radio,
  Space,
  Spin,
  Table,
  Tabs,
} from '@arco-design/web-react';
import React, { useEffect, useMemo, useState } from 'react';

import { Checkbox } from '@arco-design/web-react';
import {APIGetDeviceInfo, APIGetUserBaseInfo, APIOrderDetail, APIOrderSure} from '@/api/api';
import { getQueryString } from '@/utils/xink';
import { router } from 'next/client';
const CheckboxGroup = Checkbox.Group;
const { useForm } = Form;
const getColumns = (callback) => {
  return [
    {
      title: '照片类型',
      dataIndex: 'des',
    },
    {
      title: '照片',
      dataIndex: 'images',
      render: (_) => <Image width={200} height={200} src={_}></Image>,
    },
    {
      title: '操作',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Space>
            <Form.Item rules={[{ required: true }]} field={record.id}>
              <Radio.Group style={{ width: 300 }} type={'button'}>
                <Radio value={1}>通过</Radio>
                <Radio value={0}>拒绝</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        );
      },
    },
  ];
};

const getPhoneColumns = () => {
  return [
    {
      title: '联系人名称',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '次数',
      dataIndex: 'num',
    },
  ];
};

const getAreaColumns = () => {
  return [
    {
      title: '归属地',
      dataIndex: 'id',
    },
    {
      title: '次数',
      dataIndex: 'id',
    },
  ];
};

const getSendPersonColumns = () => {
  return [
    {
      title: '发送者',
      dataIndex: 'name',
      render: (_, record) => (
        <div>
          {_} 号码:{record.phone}
        </div>
      ),
    },
    {
      title: '次数',
      dataIndex: 'num',
    },
  ];
};

const getConnectPersonColumns = () => {
  return [
    {
      title: '联系人姓名',
      dataIndex: 'name',
    },
    {
      title: '联系人关系',
      dataIndex: 'relation',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
  ];
};

const CheckListFormItem = ({ label }) => {
  return (
    <Form.Item field={label}>
      <Radio.Group type="button">
        <Radio style={{ width: '100px', textAlign: 'center' }} value={'1'}>
          是
        </Radio>
        <Radio style={{ width: '100px', textAlign: 'center' }} value={'2'}>
          否
        </Radio>
        <Radio style={{ width: '100px', textAlign: 'center' }} value={'3'}>
          未提问
        </Radio>
      </Radio.Group>
    </Form.Item>
  );
};

const SectionTitle = ({ children }) => {
  return (
    <div
      style={{
        fontSize: '16px',
        fontWeight: 500,
        color: '#000000',
        marginBottom: '16px',
      }}
    >
      {children}
    </div>
  );
};

const OrderDetailView = () => {
  const [picForm] = useForm();
  const [actionForm] = useForm();
  const [resultForm] = useForm();

  const [baseData, setBaseData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [contractSizes, setContractSizes] = useState(0);
  const [locationData, setLocationData] = useState([]);
  const [workLocationData, setWorkLocationData] = useState([]);

  const [workInfoData, setWorkInfoData] = useState([]);
  const [workOrderData, setWorkOrderData] = useState([]);
  const [gpsData, setGpsData] = useState([]);
  const [ipsData, setIpsData] = useState([]);

  const [imageData, setImageData] = useState([]);

  const checkData = [
    {
      label: '用户额度信用分',
      value: '79',
    },
  ];

  const checkActionData = [
    {
      label: '是否是本人借款？',
      filed: 'meBorrow',
    },
    {
      label: '是否清晰知晓借款金额/期限？',
      filed: 'amount',
    },
    {
      label: '是否清晰知晓OneCard品牌？',
      filed: 'oneCardProduct',
    },
    {
      label: '是否无工作矛盾？',
      filed: 'workInfo',
    },
    {
      label: '是否无家庭信息矛盾？',
      filed: 'familyInfo',
    },
    {
      label: '是否无居住信息矛盾？',
      filed: 'liveInfo',
    },
    {
      label: '是否无电话沟通顺利？',
      filed: 'phoneCommun',
    },
  ];

  const checkImageCallBack = (record) => {
    console.log(record);
  };
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);

  const columns = useMemo(() => getColumns(checkImageCallBack), []);
  const phoneColumns = useMemo(() => getPhoneColumns(), []);
  const areaColumns = useMemo(() => getAreaColumns(), []);
  const sendPersonColumns = useMemo(() => getSendPersonColumns(), []);
  const connectPersonColumns = useMemo(() => getConnectPersonColumns(), []);
  const [imageTableData, setImageTableData] = useState([]);
  const [callInRecords, setCallInRecords] = useState([]);
  const [callOutRecords, setCallOutRecords] = useState([]);
  const [sms, setSms] = useState([]);
  const [intimateContact, setIntimateContact] = useState([]);
  const gpsColumns = [
    {
      title: '采集时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '地理位置',
      dataIndex: 'address',
      render: (_, records) => (
        <div>
          位置：{_}, 东经：{records.latitude}, 北纬：{records.longitude}{' '}
        </div>
      ),
    },
  ];
  const ipsColumns = [
    {
      title: '采集时间',
      dataIndex: 'gmtCreate',
    },
    {
      title: '地理位置',
      dataIndex: 'address',
      render: (_, records) => (
        <div>
          位置：{_}, ip地址：{records.ipAddress}
        </div>
      ),
    },
  ];

  const setUserBaseInfo = (data) => {
    if(data.personalInfo && data.workInfo){
      const personalInfo = data.personalInfo;
      const workInfo = data.workInfo;
      setBaseData([
        {
          label: '客户姓名',
          value: personalInfo.name,
        },
        {
          label: '性别',
          value: personalInfo.sex,
        },
        {
          label: '手机号',
          value: workInfo.phone,
        },
        {
          label: '年龄',
          value: personalInfo.age,
        },
        {
          label: 'Email',
          value: personalInfo.email,
        },
        {
          label: '教育水平',
          value: personalInfo.education,
        },
        {
          label: '婚姻状况',
          value: personalInfo.marry,
        },
        {
          label: '孩子数量',
          value: personalInfo.childNum,
        },
        {
          label: '居住情况',
          value: personalInfo.livingType,
        },
        {
          label: '居住年限',
          value: personalInfo.livingTime,
        },
      ]);
      setWorkInfoData([
        {
          label: '公司名称',
          value: workInfo.name,
        },
        {
          label: '所在行业',
          value: workInfo.name,
        },
        {
          label: '岗位类型',
          value: workInfo.workType,
        },
        {
          label: '工作情况',
          value: workInfo.workType,
        },
        {
          label: '薪资水平',
          value: workInfo.salaryInfo,
        },
        {
          label: '工作年限',
          value: workInfo.workYear,
        },
      ]);
      setWorkOrderData([
        {
          label: '公司名称',
          value: workInfo.name,
        },
      ]);
      setImageData([
        {
          label: '客户姓名',
          value: personalInfo.name,
        },
        {
          label: 'KTP',
          value: data.kpt.ktpNo,
        },
      ]);
      setImageTableData([
        {
          id: 'ktpOperating',
          des: 'KTP',
          image: data.kpt.photoUrl,
        },
        {
          id: 'faceOperating',
          des: '人脸识别',
          image: data.kpt.faceUrl,
        },
        {
          id: 'npwpOperating',
          des: 'NPWP',
          image: data.workCertification.npwpUrl,
        },
        {
          id: 'workOperating',
          des: '工作照/工资证明',
          image: data.workCertification.eworkUrl,
        },
        {
          id: 'bpjsOperating',
          des: 'BPJS',
          image: data.workCertification.bpjsUrl,
        },
        {
          id: 'kkOperating',
          des: 'KK',
          image: data.kpt.kkUrl,
        },
      ]);
      setLocationData([
        {
          label: '居住地址',
          value: personalInfo.address,
        },
        {
          label: '居住城市',
          value: personalInfo.city,
        },
        {
          label: '居住区县',
          value: personalInfo.county,
        },
        {
          label: '居住村',
          value: personalInfo.address,
        },
        {
          label: '详细地址',
          value: personalInfo.address,
        },
      ]);
      setWorkLocationData([
        {
          label: '公司所在省份',
          value: workInfo.province,
        },
        {
          label: '公司所在城市',
          value: workInfo.city,
        },
        {
          label: '公司所在区县',
          value: workInfo.county,
        },
        {
          label: '公司所在村',
          value: workInfo.address,
        },
        {
          label: '公司详细地址',
          value: workInfo.address,
        },
      ]);
      setGpsData(data.gps);
      setIpsData(data.ips);
      setIntimateContact(data.intimateContact);
    }
  };

  const setDeviceInfo = (data) => {
    setDeviceData(data.deviceInfos.centent);
    setContractSizes(data.contractSizes);
    setCallInRecords(data.callInRecords);
    setCallOutRecords(data.callOutRecords);
    setSms(data.sms);
  };

  const setOrderInfo = (data) => {
    setOrderData([
      {
        label: '开户银行',
        value: data.bankName,
      },
      {
        label: '银行账户',
        value: data.bankNo,
      },
      {
        label: '信用额度',
        value: data.creditQuota,
      },
      {
        label: '可用额度',
        value: data.availableQuota,
      },
      {
        label: '借款金额',
        value: data.loanAmount,
      },
      {
        label: '借款期限',
        value: data.loanDate,
      },
    ]);
  }

  const getUserInfo = () => {
    setLoading(true);
    const userId = getQueryString('userId');
    APIGetUserBaseInfo({
      userId: userId,
    })
      .then((resp: any) => {
        if (resp.data) {
          setUserBaseInfo(resp.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDeviceInfo = () => {
    setLoading(true);
    const userId = getQueryString('userId');
    APIGetDeviceInfo({
      userId: userId,
    })
      .then((resp: any) => {
        if (resp.data) {
          setDeviceInfo(resp.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getOrderInfo = () => {
    setLoading(true);
    const orderNo = getQueryString('orderNo');
    APIOrderDetail({
      orderNo: orderNo,
    })
      .then((resp: any) => {
        if (resp.data) {
          setOrderInfo(resp.data.loanOrder);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getUserInfo();
    getDeviceInfo();
    getOrderInfo();
  }, []);

  const orderSure = async () => {
    try {
      await picForm.validate();
    } catch (e) {
      Message.error('请先完成审批选择项!');
      setActiveTab('2');
      return;
    }

    try {
      await actionForm.validate();
    } catch (e) {
      return Message.error('请完成审核操作选择项!');
    }

    try {
      await resultForm.validate();
    } catch (e) {
      Message.error('请选择是否通过审核！');
      return;
    }

    const resParams = resultForm.getFieldsValue();

    for (const key in resParams) {
      if (resParams[key] === true) {
        resParams[key] = 1;
      }

      if (resParams[key] === undefined) {
        resParams[key] = 0;
      }
    }

    setLoading(true);
    APIOrderSure({
      ...picForm.getFieldsValue(),
      ...actionForm.getFieldsValue(),
      ...resParams,
      orderNo: getQueryString('orderNo'),
    })
      .then((resp: any) => {
        if (resp.data) {
          Message.success('审核成功！');
          router.push('/work-order-management/work-order-check');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Spin loading={loading} style={{ width: '100%' }}>
      <Card style={{ minHeight: '100vh' }}>
        <Tabs activeTab={activeTab} lazyload={false} onChange={setActiveTab}>
          <Tabs.TabPane key={'1'} title={'客户基本信息'}>
            <Descriptions border data={baseData} />
            <div style={{ height: '20px' }}></div>
            <Descriptions title={'工作信息'} border data={workInfoData} />
            <div style={{ height: '20px' }}></div>
            <Descriptions title={'工单信息'} border data={orderData} />
          </Tabs.TabPane>

          <Tabs.TabPane key={'2'} title={'照片审核'}>
            <Descriptions border data={imageData} />
            <div style={{ height: '20px' }}></div>
            <Form form={picForm}>
              <Table data={imageTableData} columns={columns} />
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane key={'3'} title={'地理位置'}>
            <Descriptions title={'居住地址'} border data={locationData} />
            <div style={{ height: '20px' }}></div>
            <Descriptions title={'公司地址'} border data={workLocationData} />
            <div style={{ height: '20px' }}></div>
            <SectionTitle>设备定位（GPS）</SectionTitle>
            <Table columns={gpsColumns} data={gpsData} />
            <SectionTitle>IP地址</SectionTitle>
            <Table columns={ipsColumns} data={ipsData} />
          </Tabs.TabPane>

          <Tabs.TabPane key={'4'} title={'设备信息'}>
            <SectionTitle>设备信息</SectionTitle>
            <Table
              columns={[
                {
                  title: '用户ID',
                  dataIndex: 'userId',
                },
                {
                  title: '手机号',
                  dataIndex: 'phone',
                },
              ]}
              data={deviceData}
            />
            <div style={{ height: '20px' }}></div>
            <Descriptions
              title={'设备通讯录个数'}
              border
              data={[
                {
                  label: '通讯录个数',
                  value: contractSizes,
                },
              ]}
            />
            <div style={{ height: '20px' }}></div>
            <SectionTitle>设备通话记录</SectionTitle>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: '1' }}>
                <SectionTitle>呼入前十</SectionTitle>
                <div style={{ height: '10px' }}></div>
                <Table
                  style={{
                    width: '600px',
                  }}
                  data={callInRecords}
                  columns={phoneColumns}
                />
              </div>
              <div style={{ flex: '1' }}>
                <SectionTitle>呼出前十</SectionTitle>
                <div style={{ height: '10px' }}></div>
                <Table
                  style={{
                    width: '600px',
                  }}
                  data={callOutRecords}
                  columns={phoneColumns}
                />
              </div>
            </Space>

            {
              //   <SectionTitle>归属地前五</SectionTitle>
              //   <Space style={{display:"flex", justifyContent:"space-between"}}>
              //   <div style={{flex:"1"}}>
              //   <div style={{height:"10px"}}></div>
              //   <Table
              //   style={{
              //   width:"600px"
              // }}
              //   data={imageTableData}
              //   columns={areaColumns}
              //   />
              //   </div>
              //   </Space>
            }

            <SectionTitle>短信</SectionTitle>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: '1' }}>
                <div style={{ height: '10px' }}></div>
                <Table
                  style={{
                    width: '600px',
                  }}
                  data={sms}
                  columns={sendPersonColumns}
                />
              </div>
            </Space>
          </Tabs.TabPane>

          <Tabs.TabPane key={'5'} title={'社交信息'}>
            <SectionTitle>紧急联系人</SectionTitle>
            <Table
              style={{
                width: '600px',
              }}
              data={intimateContact}
              columns={connectPersonColumns}
            />
            <div style={{ height: '20px' }}></div>
            {/* <Descriptions title={'Facebook'} border data={baseData} />*/}
          </Tabs.TabPane>

          <Tabs.TabPane key={'6'} title={'审核意见'}>
            <Descriptions border data={checkData} />
            <div style={{ height: '20px' }}></div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>审核操作</div>
              <Divider type={'vertical'} />
              <div>
                <Form form={actionForm}>
                  {checkActionData.map((item, index) => {
                    return (
                      <Form.Item
                        rules={[{ required: true }]}
                        key={index}
                        style={{ width: '1000px' }}
                        field={item.filed}
                        label={item.label}
                      >
                        <Radio.Group type="button">
                          <Radio
                            style={{ width: '100px', textAlign: 'center' }}
                            value={1}
                          >
                            是
                          </Radio>
                          <Radio
                            style={{ width: '100px', textAlign: 'center' }}
                            value={0}
                          >
                            否
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    );
                  })}
                </Form>
              </div>
            </div>
            <Divider />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '900px',
              }}
            >
              <div>审核结果</div>
              <div
                style={{
                  width: '700px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <Form form={resultForm}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Item rules={[{ required: true }]} field={'result'}>
                      <Radio.Group type="button">
                        <Radio
                          style={{ width: '100px', textAlign: 'center' }}
                          value={0}
                        >
                          拒绝
                        </Radio>
                        <Radio
                          style={{ width: '100px', textAlign: 'center' }}
                          value={1}
                        >
                          通过
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Button onClick={orderSure} type={'primary'}>
                      提交
                    </Button>
                  </div>
                  {[
                    {
                      label: '个人信息异常',
                      value: 'personAbnormal',
                    },
                    {
                      label: '工单信息异常',
                      value: 'orderAbnormal',
                    },
                    {
                      label: '工作信息异常',
                      value: 'workAbnormal',
                    },
                    {
                      label: '地理位置异常',
                      value: 'addressAbnormal',
                    },
                    {
                      label: '设备信息异常',
                      value: 'equipmentAbnormal',
                    },
                    {
                      label: '社交信息异常',
                      value: 'socialAbnormal',
                    },
                  ].map((item) => {
                    return (
                      <Form.Item key={item.value} field={item.value}>
                        <Checkbox>{item.label} </Checkbox>
                      </Form.Item>
                    );
                  })}

                  <Form.Item field={'remarks'} label={'备注'}>
                    <Input.TextArea></Input.TextArea>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Spin>
  );
};

export default OrderDetailView;
