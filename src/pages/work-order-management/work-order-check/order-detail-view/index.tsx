import {
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Image, Input,
  PageHeader,
  Radio,
  Space,
  Table,
  Tabs
} from "@arco-design/web-react";
import React, {useMemo, useState} from "react";

import { Checkbox } from '@arco-design/web-react';
const CheckboxGroup = Checkbox.Group;
const getColumns = (callback) => {
  return [
    {
      title: '类型',
      dataIndex: 'id',
    },
    {
      title: '照片',
      dataIndex: 'images',
      render:(_)=><Image width={300} height={300} src={_}></Image>
    },
    {
      title: '操作',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Space>
            <Button type="primary" size="small" onClick={(e) => callback(record)}>
              通过
            </Button>
            <Button type="default" status={"danger"} size="small" onClick={(e) => callback(record)}>
              拒绝
            </Button>
            <Button type="dashed" status={"warning"} size="small" onClick={(e) => callback(record)}>
              退回
            </Button>
          </Space>
        )
      }
    },
  ];
}

const getPhoneColumns = () => {
  return [
    {
      title: '联系人名称',
      dataIndex: 'id',
    },
    {
      title: '电话',
      dataIndex: 'id',
    },
    {
      title: '次数',
      dataIndex: 'id',
    },
  ];
}

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
}

const getSendPersonColumns = () => {
  return [
    {
      title: '发送者',
      dataIndex: 'id',
    },
    {
      title: '次数',
      dataIndex: 'id',
    },
  ];
}

const getConnectPersonColumns = () => {
  return [
    {
      title: '联系人姓名',
      dataIndex: 'id',
    },
    {
      title: '联系人关系',
      dataIndex: 'id',
    },
    {
      title: '电话',
      dataIndex: 'id',
    },
  ];
}

const CheckListFormItem = ({label}) =>{
  return <Form.Item field={label}>
    <Radio.Group   type='button'>
      <Radio style={{width:"100px", textAlign:"center"}} value={"1"}>
        是
      </Radio>
      <Radio style={{width:"100px", textAlign:"center"}} value={"2"}>
        否
      </Radio>
      <Radio style={{width:"100px", textAlign:"center"}} value={"3"}>
        未提问
      </Radio>
    </Radio.Group>
  </Form.Item>
}

const OrderDetailView = () =>{

  const baseData = [
    {
      label: 'Name',
      value: 'Socrates',
    },
    {
      label: 'Mobile',
      value: '123-1234-1234',
    },
    {
      label: 'Residence',
      value: 'Beijing',
    },
    {
      label: 'Hometown',
      value: 'Beijing',
    },
    {
      label: 'Date of Birth',
      value: '2020-05-15',
      span: 2,
    },
    {
      label: 'Address',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
  ];

  const imageData = [
    {
      label: 'Name',
      value: 'Socrates',
    },
    {
      label: 'Mobile',
      value: '123-1234-1234',
    },
  ]

  const checkData = [
    {
      label: '用户额度信用分',
      value: '79',
    },
  ]

  const checkActionData = [
    {
      label: '是否是本人借款？',
      filed:"type"
    },
    {
      label: '是否清晰知晓借款金额/期限？',
      filed:"type"
    },
    {
      label: '是否清晰知晓OneCard品牌？',
      filed:"type"
    },
    {
      label: '是否无工作矛盾？',
      filed:"type"
    },
    {
      label: '是否无家庭信息矛盾？',
      filed:"type"
    },
    {
      label: '是否无居住信息矛盾？',
      filed:"type"
    },
    {
      label: '是否无电话沟通顺利？',
      filed:"type"
    },
  ]

  const checkImageCallBack = (record) => {
    console.log(record)
  };

  const columns = useMemo(()=>getColumns(checkImageCallBack), []);
  const phoneColumns = useMemo(()=>getPhoneColumns(), []);
  const areaColumns = useMemo(()=>getAreaColumns(), []);
  const sendPersonColumns = useMemo(()=>getSendPersonColumns(), []);
  const connectPersonColumns = useMemo(()=>getConnectPersonColumns(), []);
  const [imageTableData, setImageTableData] = useState([
    {
      id:"KTP",
    }
  ]);



  return <Card style={{minHeight:"100vh"}}>
    <Tabs>

      <Tabs.TabPane key={1} title={"客户基本信息"}>
        <Descriptions title={'User Info'} border data={baseData} />
        <div style={{height:"20px"}}></div>
        <Descriptions title={'User Info'} border data={baseData} />
        <div style={{height:"20px"}}></div>
        <Descriptions title={'User Info'} border data={baseData} />
      </Tabs.TabPane>

      <Tabs.TabPane key={2} title={"照片审核"}>
        <Descriptions border data={imageData} />
        <div style={{height:"20px"}}></div>
        <Table
          data={imageTableData}
          columns={columns}
        />
      </Tabs.TabPane>

      <Tabs.TabPane key={3} title={"地理位置"}>
        <Descriptions title={'User Info'} border data={baseData} />
        <div style={{height:"20px"}}></div>
        <Descriptions title={'User Info'} border data={baseData} />
        <div style={{height:"20px"}}></div>
        <Descriptions title={'User Info'} border data={baseData} />
      </Tabs.TabPane>

      <Tabs.TabPane key={4} title={"设备信息"}>
        <Descriptions title={'User Info'} border data={baseData} />
        <div style={{height:"20px"}}></div>
        <Descriptions title={'User Info'} border data={baseData} />
        <div style={{height:"20px"}}></div>
        <PageHeader
          title='设备通话记录'
        />
        <Space style={{display:"flex", justifyContent:"space-between"}}>
          <div style={{flex:"1"}}>
            <div>呼入前十</div>
            <div style={{height:"10px"}}></div>
            <Table
              style={{
                width:"600px"
              }}
              data={imageTableData}
              columns={phoneColumns}
            />
          </div>
          <div style={{flex:"1"}}>
            <div>呼出前十</div>
            <div style={{height:"10px"}}></div>
            <Table
              style={{
                width:"600px"
              }}
              data={imageTableData}
              columns={phoneColumns}
            />
          </div>
        </Space>

        <PageHeader
          title='归属地前五'
        />

        <Space style={{display:"flex", justifyContent:"space-between"}}>
          <div style={{flex:"1"}}>
            <div style={{height:"10px"}}></div>
            <Table
              style={{
                width:"600px"
              }}
              data={imageTableData}
              columns={areaColumns}
            />
          </div>
        </Space>

        <PageHeader
          title='短信'
        />

        <Space style={{display:"flex", justifyContent:"space-between"}}>
          <div style={{flex:"1"}}>
            <div style={{height:"10px"}}></div>
            <Table
              style={{
                width:"600px"
              }}
              data={imageTableData}
              columns={sendPersonColumns}
            />
          </div>
        </Space>

      </Tabs.TabPane>

      <Tabs.TabPane key={5} title={"社交信息"}>
        <PageHeader
          title='紧急联系人'
        />
        <Table
          style={{
            width:"600px"
          }}
          data={imageTableData}
          columns={connectPersonColumns}
        />
        <div style={{height:"20px"}}></div>
        <Descriptions title={'Facebook'} border data={baseData} />
      </Tabs.TabPane>

      <Tabs.TabPane key={6} title={"审核意见"}>
        <Descriptions border data={checkData} />
        <div style={{height:"20px"}}></div>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            审核操作
          </div>
          <Divider type={"vertical"} />
          <div>
            <Form>
              {
                checkActionData.map( (item, index) => {
                  return  <Form.Item key={index} style={{width:"1000px"}} field={item.filed}  label={item.label}>
                    <Radio.Group  type='button'>
                      <Radio style={{width:"100px", textAlign:"center"}} value={"1"}>
                        是
                      </Radio>
                      <Radio style={{width:"100px", textAlign:"center"}} value={"2"}>
                        否
                      </Radio>
                      <Radio style={{width:"100px", textAlign:"center"}} value={"3"}>
                        未提问
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                })
              }
            </Form>
          </div>
        </div>
        <Divider />
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"900px"}}>
          <div>
            审核结果
          </div>
          <div style={{width:"700px", display:"flex", flexDirection:"column", justifyContent:"flex-start", alignItems:"flex-start"}}>
            <Form>
              <div style={{display:"flex", alignItems:"center"}}>
                <Form.Item>
                  <Radio.Group  type='button'>
                    <Radio style={{width:"100px", textAlign:"center"}} value={"1"}>
                      拒绝
                    </Radio>
                    <Radio style={{width:"100px", textAlign:"center"}} value={"2"}>
                      通过
                    </Radio>
                    <Radio style={{width:"100px", textAlign:"center"}} value={"3"}>
                      退回
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Button type={"primary"}>提交</Button>
              </div>
              <Form.Item>
                <CheckboxGroup direction='vertical' options={['个人信息异常', '工作信息异常', '工作单位异常', '地理位置异常', '设备信息异常', '社交信息异常']} />
              </Form.Item>
              <Form.Item  label={"备注"}>
                <Input.TextArea>

                </Input.TextArea>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Tabs.TabPane>

    </Tabs>
  </Card>
}

export default OrderDetailView;
