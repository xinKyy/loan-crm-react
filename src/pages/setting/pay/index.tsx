import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Message,
  Space,
  Spin,
  Switch,
  Tabs,
} from '@arco-design/web-react';
import styles from './index.module.less';
import {
  APIComplementAddress,
  APIGetAISPrice,
  APIGetConfigAddress,
  APIGetConfigListRsp,
  APIGrantFundsAddress,
  APIPosFundsAddress,
  APISearchFundsAddress,
  APISetAISPrice,
} from '@/api/api';
import TimerPriceTableComponents from '@/pages/setting/pay/timerPriceTableComponents';
const TabPane = Tabs.TabPane;
const { useForm } = Form;
function Configuration() {
  const [configAddress, setConfigAddress] = useState(null);
  const [seaAddress, setSeaAddress] = useState({
    address: '',
    adminAddress: '',
  });
  const [grantFundsAddress, setGrantFundsAddress] = useState({
    address: '',
    adminAddress: '',
  });
  const [posFundsAddress, setPosFundsAddress] = useState({
    address: '',
    adminAddress: '',
  });

  const [currentConfigAddress, setCurrentConfigAddress] = useState('');

  const [loading, setLoading] = useState(false);

  const [form1] = useForm();

  useEffect(() => {
    getAisPrice();
  }, []);

  const setAisPrice = () => {
    setLoading(true);
    APISetAISPrice({
      ...form1.getFieldsValue(),
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('设置AIS价格成功！');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAisPrice = () => {
    APIGetAISPrice({}).then((resp: any) => {
      if (resp.result) {
        form1.setFieldValue('price', resp.result);
      }
    });
  };

  return (
    <Card style={{ height: '75vh' }}>
      <Spin style={{ width: '100%' }} loading={loading}>
        <Tabs defaultActiveTab="1">
          <TabPane key="1" title="币价配置">
            <Form onSubmit={setAisPrice} form={form1}>
              <Form.Item
                style={{ width: '700px' }}
                required
                extra={'用于前端AIS币价展示'}
                field={'price'}
                label={'AIS币价配置'}
              >
                <Input type={'number'} placeholder={'请输入价格'}></Input>
              </Form.Item>
              <Space style={{ paddingLeft: '200px', paddingTop: '50px' }}>
                <Button onClick={() => form1.resetFields()}>重置</Button>
                <Button htmlType={'submit'} type={'primary'}>
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>

          <TabPane key="2" title="定时调价">
            <TimerPriceTableComponents></TimerPriceTableComponents>
          </TabPane>

          {/*<TabPane key="2" title="探索基金配置">*/}
          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div*/}
          {/*    style={{ display: 'flex', width: '400px', alignItems: 'center' }}*/}
          {/*  >*/}
          {/*    <div style={{ width: '130px', textAlign: 'end' }}>*/}
          {/*      <span style={{ color: 'red' }}>*</span>钱管理员地址*/}
          {/*    </div>*/}
          {/*    <div style={{ flex: '1', marginLeft: '30px' }}>*/}
          {/*      <Input*/}
          {/*        value={seaAddress.adminAddress}*/}
          {/*        onChange={(v) =>*/}
          {/*          setSeaAddress({ ...seaAddress, adminAddress: v })*/}
          {/*        }*/}
          {/*        placeholder={'请输入钱管理员地址'}*/}
          {/*      ></Input>*/}
          {/*      <div style={{ fontSize: 12, zoom: '0.8' }}>*/}
          {/*        控制探索基金地址的管理员地址*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div*/}
          {/*    style={{ display: 'flex', width: '400px', alignItems: 'center' }}*/}
          {/*  >*/}
          {/*    <div style={{ width: '130px', textAlign: 'end' }}>*/}
          {/*      <span style={{ color: 'red' }}>*</span>探索基金钱包地址*/}
          {/*    </div>*/}
          {/*    <div style={{ flex: '1', marginLeft: '30px' }}>*/}
          {/*      <Input*/}
          {/*        value={seaAddress.address}*/}
          {/*        onChange={(v) => setSeaAddress({ ...seaAddress, address: v })}*/}
          {/*        placeholder={'请输入钱包地址'}*/}
          {/*      ></Input>*/}
          {/*      <div style={{ fontSize: 12, zoom: '0.8' }}>*/}
          {/*        自动转入的探索基金地址的钱包私钥*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div className={styles.row_flex}>*/}
          {/*    <div className={styles.left}>自动转入比例</div>*/}
          {/*    <div className={styles.right}>*/}
          {/*      <InputNumber*/}
          {/*        disabled={true}*/}
          {/*        mode="button"*/}
          {/*        defaultValue={40}*/}
          {/*        value={40}*/}
          {/*        style={{ width: 160, margin: '10px 24px 10px 0' }}*/}
          {/*      />*/}
          {/*      <div className={styles.text}>*/}
          {/*        订单支付成功后自动给探索基金地址转入的比例，例:0.5 =*/}
          {/*        返订单金额的50%*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div style={{ height: 50 }}></div>*/}
          {/*  <Button*/}
          {/*    type={'primary'}*/}
          {/*    onClick={submitSearchFundsAddress}*/}
          {/*    style={{ width: 200, marginLeft: 50 }}*/}
          {/*  >*/}
          {/*    提交*/}
          {/*  </Button>*/}
          {/*</TabPane>*/}
          {/*<TabPane key="3" title="保本基金配置">*/}
          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div*/}
          {/*    style={{ display: 'flex', width: '400px', alignItems: 'center' }}*/}
          {/*  >*/}
          {/*    <div style={{ width: '130px', textAlign: 'end' }}>*/}
          {/*      <span style={{ color: 'red' }}>*</span>钱管理员地址*/}
          {/*    </div>*/}
          {/*    <div style={{ flex: '1', marginLeft: '30px' }}>*/}
          {/*      <Input*/}
          {/*        value={grantFundsAddress.adminAddress}*/}
          {/*        onChange={(v) =>*/}
          {/*          setGrantFundsAddress({*/}
          {/*            ...grantFundsAddress,*/}
          {/*            adminAddress: v,*/}
          {/*          })*/}
          {/*        }*/}
          {/*        placeholder={'请输入钱管理员地址'}*/}
          {/*      ></Input>*/}
          {/*      <div style={{ fontSize: 12, zoom: '0.8' }}>*/}
          {/*        控制保本基金地址的管理员地址*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div*/}
          {/*    style={{ display: 'flex', width: '400px', alignItems: 'center' }}*/}
          {/*  >*/}
          {/*    <div style={{ width: '130px', textAlign: 'end' }}>*/}
          {/*      <span style={{ color: 'red' }}>*</span>保本基金钱包地址*/}
          {/*    </div>*/}
          {/*    <div style={{ flex: '1', marginLeft: '30px' }}>*/}
          {/*      <Input*/}
          {/*        value={grantFundsAddress.address}*/}
          {/*        onChange={(v) =>*/}
          {/*          setGrantFundsAddress({ ...grantFundsAddress, address: v })*/}
          {/*        }*/}
          {/*        placeholder={'请输入钱包地址'}*/}
          {/*      ></Input>*/}
          {/*      <div style={{ fontSize: 12, zoom: '0.8' }}>*/}
          {/*        自动转入的保本基金地址的钱包私钥*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div className={styles.row_flex}>*/}
          {/*    <div className={styles.left}>自动转入比例</div>*/}
          {/*    <div className={styles.right}>*/}
          {/*      <InputNumber*/}
          {/*        disabled={true}*/}
          {/*        mode="button"*/}
          {/*        defaultValue={40}*/}
          {/*        value={40}*/}
          {/*        style={{ width: 160, margin: '10px 24px 10px 0' }}*/}
          {/*      />*/}
          {/*      <div className={styles.text}>*/}
          {/*        订单支付成功后自动给保本基金地址转入的比例，例:0.5 =*/}
          {/*        返订单金额的50%*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div style={{ height: 50 }}></div>*/}
          {/*  <Button*/}
          {/*    type={'primary'}*/}
          {/*    onClick={submitGrantFundsAddress}*/}
          {/*    style={{ width: 200, marginLeft: 50 }}*/}
          {/*  >*/}
          {/*    提交*/}
          {/*  </Button>*/}
          {/*</TabPane>*/}
          {/*<TabPane key="4" title="共识基金配置">*/}
          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div*/}
          {/*    style={{ display: 'flex', width: '400px', alignItems: 'center' }}*/}
          {/*  >*/}
          {/*    <div style={{ width: '130px', textAlign: 'end' }}>*/}
          {/*      <span style={{ color: 'red' }}>*</span>钱管理员地址*/}
          {/*    </div>*/}
          {/*    <div style={{ flex: '1', marginLeft: '30px' }}>*/}
          {/*      <Input*/}
          {/*        value={posFundsAddress.adminAddress}*/}
          {/*        onChange={(v) =>*/}
          {/*          setPosFundsAddress({ ...posFundsAddress, adminAddress: v })*/}
          {/*        }*/}
          {/*        placeholder={'请输入钱管理员地址'}*/}
          {/*      ></Input>*/}
          {/*      <div style={{ fontSize: 12, zoom: '0.8' }}>*/}
          {/*        控制共识基金地址的管理员地址*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div*/}
          {/*    style={{ display: 'flex', width: '400px', alignItems: 'center' }}*/}
          {/*  >*/}
          {/*    <div style={{ width: '130px', textAlign: 'end' }}>*/}
          {/*      <span style={{ color: 'red' }}>*</span>共识基金钱包地址*/}
          {/*    </div>*/}
          {/*    <div style={{ flex: '1', marginLeft: '30px' }}>*/}
          {/*      <Input*/}
          {/*        value={posFundsAddress.address}*/}
          {/*        onChange={(v) =>*/}
          {/*          setPosFundsAddress({ ...posFundsAddress, address: v })*/}
          {/*        }*/}
          {/*        placeholder={'请输入钱包地址'}*/}
          {/*      ></Input>*/}
          {/*      <div style={{ fontSize: 12, zoom: '0.8' }}>*/}
          {/*        自动转入的共识基金地址的钱包地址*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div style={{ height: 20 }}></div>*/}
          {/*  <div className={styles.row_flex}>*/}
          {/*    <div className={styles.left}>自动转入比例</div>*/}
          {/*    <div className={styles.right}>*/}
          {/*      <InputNumber*/}
          {/*        disabled={true}*/}
          {/*        mode="button"*/}
          {/*        defaultValue={20}*/}
          {/*        value={20}*/}
          {/*        style={{ width: 160, margin: '10px 24px 10px 0' }}*/}
          {/*      />*/}
          {/*      <div className={styles.text}>*/}
          {/*        订单支付成功后自动给共识基金地址转入的比例，例:0.5 =*/}
          {/*        返订单金额的50%*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div style={{ height: 50 }}></div>*/}
          {/*  <Button*/}
          {/*    type={'primary'}*/}
          {/*    onClick={submitPosFundsAddress}*/}
          {/*    style={{ width: 200, marginLeft: 50 }}*/}
          {/*  >*/}
          {/*    提交*/}
          {/*  </Button>*/}
          {/*</TabPane>*/}
        </Tabs>
      </Spin>
    </Card>
  );
}

export default Configuration;
