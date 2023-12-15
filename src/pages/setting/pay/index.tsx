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
  APIGetConfigAddress,
  APIGetConfigListRsp,
  APIGrantFundsAddress,
  APIPosFundsAddress,
  APISearchFundsAddress,
} from '@/api/api';
import TimerPriceTableComponents from '@/pages/setting/pay/timerPriceTableComponents';
const TabPane = Tabs.TabPane;
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

  const getConfigAddress = () => {
    setLoading(true);
    APIGetConfigAddress({
      configKey: 'COMPLEMENT_ADDRESS',
    })
      .then((resp: any) => {
        if (resp.result) {
          setCurrentConfigAddress(resp.result.address);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getConfigListRsp = () => {
    setLoading(true);
    APIGetConfigListRsp({})
      .then((resp: any) => {
        if (resp.result) {
          resp.result.forEach((item) => {
            if (item.key === 'COMPLEMENT_ADDRESS') {
              setCurrentConfigAddress(item.fundsAddress);
            }
            if (item.key === 'GRANT_FUNDS') {
              setGrantFundsAddress({
                adminAddress: item.adminAddress,
                address: item.fundsAddress,
              });
            }
            if (item.key === 'SEARCH_FUNDS') {
              setSeaAddress({
                adminAddress: item.adminAddress,
                address: item.fundsAddress,
              });
            }
            if (item.key === 'POS_FUNDS') {
              setPosFundsAddress({
                adminAddress: item.adminAddress,
                address: item.fundsAddress,
              });
            }
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getConfigAddress();
    getConfigListRsp();
  }, []);

  const submitAddress = () => {
    setLoading(true);
    APIComplementAddress({
      complementAddress: configAddress,
    })
      .then((resp: any) => {
        if (resp.result) {
          setCurrentConfigAddress(configAddress);
          Message.info('修改差额补足账户成功！');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitSearchFundsAddress = () => {
    if (!seaAddress.address || !seaAddress.adminAddress) {
      return Message.info('两个地址必须一起提交！');
    }

    setLoading(true);
    APISearchFundsAddress({
      searchFunds: seaAddress.address,
      ...seaAddress,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.info('修改成功！');
          getConfigListRsp();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitGrantFundsAddress = () => {
    if (!grantFundsAddress.address || !grantFundsAddress.adminAddress) {
      return Message.info('两个地址必须一起提交！');
    }
    setLoading(true);
    APIGrantFundsAddress({
      grantFunds: grantFundsAddress.address,
      ...grantFundsAddress,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.info('修改成功！');
          getConfigListRsp();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitPosFundsAddress = () => {
    if (!posFundsAddress.address || !posFundsAddress.adminAddress) {
      return Message.info('两个地址必须一起提交！');
    }
    setLoading(true);
    APIPosFundsAddress({
      posFunds: posFundsAddress.address,
      ...posFundsAddress,
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.info('修改成功！');
          getConfigListRsp();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card style={{ height: '75vh' }}>
      <Spin style={{ width: '100%' }} loading={loading}>
        <Tabs defaultActiveTab="1">
          <TabPane key="1" title="币价配置">
            <Form>
              <Form.Item
                style={{ width: '700px' }}
                required
                extra={'用于前端AIS币价展示'}
                label={'AIS币价配置'}
              >
                <Input placeholder={'请输入价格'}></Input>
              </Form.Item>
            </Form>
            <Space style={{ paddingLeft: '200px', paddingTop: '50px' }}>
              <Button>重置</Button>
              <Button type={'primary'}>提交</Button>
            </Space>
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
