import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Switch,
  Tabs,
  DatePicker,
  Divider,
  Input,
  Space,
  Button,
  Message,
  Spin,
} from '@arco-design/web-react';
import styles from './index.module.less';
import {
  APIGetUsdtWithDrawConfig,
  APIGetWithDrawConfig,
  APISetUsdtCollect,
  APISetUsdtWithDrawConfig,
  APISetWithDrawConfig,
} from '@/api/api';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const { useForm } = Form;

function Configuration() {
  const [form] = useForm();
  const [form2] = useForm();
  const [form3] = useForm();
  const [form4] = useForm();
  const [form5] = useForm();
  const [form6] = useForm();
  const [form7] = useForm();
  const [form8] = useForm();

  const [state, setState] = useState({
    usdtFlag: false,
    aisFlag: false,
  });
  const [loading, setLoading] = useState(false);
  const saveWithDrawConfig = async () => {
    setLoading(true);
    APISetWithDrawConfig({
      ...form.getFieldsValue(),
      USDT_WITHDRAW_OPEN_TIME:
        form.getFieldValue('USDT_WITHDRAW_OPEN_TIME')[0] +
        '|' +
        form.getFieldValue('USDT_WITHDRAW_OPEN_TIME')[1],
      AIS_WITHDRAW_OPEN_TIME:
        form.getFieldValue('AIS_WITHDRAW_OPEN_TIME')[0] +
        '|' +
        form.getFieldValue('AIS_WITHDRAW_OPEN_TIME')[1],
      USDT_WITHDRAW_OPEN_FLAG: state.usdtFlag ? '1' : '0',
      AIS_WITHDRAW_OPEN_FLAG: state.aisFlag ? '1' : '0',
    })
      .then((resp: any) => {
        if (resp.result) {
          Message.success('保存配置成功！');
          getWithDrawConfig();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getWithDrawConfig = () => {
    setLoading(true);
    APIGetWithDrawConfig({})
      .then((resp: any) => {
        form.setFieldsValue({
          USDT_LOW_WITHDRAW: resp.result.usdtLowWithdraw,
          USDT_WITHDRAW_FEE: resp.result.usdtWithdrawFee,
          USDT_CHECK_MINXM: resp.result.usdtCheckMinxm,
          USDT_WITHDRAW_OPEN_TIME: [
            resp.result.usdtWithdrawOpenTime.split('|')[0],
            resp.result.usdtWithdrawOpenTime.split('|')[1],
          ],
          AIS_LOW_WITHDRAW: resp.result.aisLowWithdraw,
          AIS_LOW_WITHDRAW_FEE: resp.result.aisLowWithdrawFee,
          AIS_CHECK_MINXM: resp.result.aisCheckMinxm,
          AIS_WITHDRAW_OPEN_TIME: [
            resp.result.aisWithdrawOpenTime.split('|')[0],
            resp.result.aisWithdrawOpenTime.split('|')[1],
          ],
        });
        setState({
          usdtFlag: resp.result.usdtWithdrawOpenFlag === '1',
          aisFlag: resp.result.aisWithdrawOpenFlag === '1',
        });

        form3.setFieldsValue({
          address: resp.result.usdtCollectAddress,
        });
        form4.setFieldsValue({
          address: resp.result.feeAddress,
          privateKey: resp.result.feeSecret,
        });
        form5.setFieldsValue({
          address: resp.result.aisWithDrawAddress,
          privateKey: resp.result.aisWithDrawSecret,
        });
        form6.setFieldsValue({
          address: resp.result.aisCollectAddress,
        });
        form7.setFieldsValue({
          USDT_TRANSFER_LOW: resp.result.usdtLowTransferNum,
          USDT_TRANSFER_FEE: resp.result.usdtLowTransferFee,
          AIS_TRANSFER_LOW: resp.result.aisLowTransferNum,
          AIS_TRANSFER_FEE: resp.result.aisLowTransferFee,
        });
        form8.setFieldsValue({
          address: resp.result.aisBurnAddress,
          privateKey: resp.result.aisBurnSecret,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveUsdtWithDrawConfig = () => {
    setLoading(true);
    APISetUsdtWithDrawConfig({
      ...form2.getFieldsValue(),
    })
      .then((resp: any) => {
        Message.success('保存配置成功！');
        getUsdtWithDrawConfig();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUsdtWithDrawConfig = () => {
    APIGetUsdtWithDrawConfig({}).then((resp: any) => {
      form2.setFieldsValue({
        ...resp.result,
      });
    });
  };

  const saveUsdtCollect = (currentForm, url) => {
    setLoading(true);
    APISetUsdtCollect(
      {
        ...currentForm.getFieldsValue(),
      },
      url
    )
      .then((resp: any) => {
        Message.success('保存配置成功！');
        getWithDrawConfig();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getWithDrawConfig();
    getUsdtWithDrawConfig();
  }, []);

  return (
    <Spin loading={loading}>
      <Card>
        <Tabs defaultActiveTab="1">
          <TabPane key="1" title="提现配置">
            <Form
              style={{ width: '700px' }}
              onSubmit={() => saveWithDrawConfig()}
              form={form}
            >
              <Form.Item
                rules={[{ required: true }]}
                required
                label={'USDT最低提现个数'}
                field={'USDT_LOW_WITHDRAW'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                required
                rules={[{ required: true }]}
                label={'USDT提现手续费（固额）'}
                extra="每次提现扣除手续费，计费方式USDT固定额度"
                field={'USDT_WITHDRAW_FEE'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                required
                rules={[{ required: true }]}
                field={'USDT_CHECK_MINXM'}
                label={'USDT提现自动审核通过最小个数'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                field={'USDT_WITHDRAW_OPEN_TIME'}
                label={'USDT提现开放时间'}
              >
                <RangePicker
                  style={{ width: 360 }}
                  showTime={{
                    defaultValue: ['00:00', '00:00'],
                    format: 'HH:mm',
                  }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
              <Form.Item
                required
                label={'USDT提现开关'}
                field={'USDT_WITHDRAW_OPEN_FLAG'}
              >
                <Switch
                  checked={state.usdtFlag}
                  onChange={(v) => {
                    setState({
                      ...state,
                      usdtFlag: v,
                    });
                  }}
                />
              </Form.Item>
              <Divider />
              <Form.Item
                rules={[{ required: true }]}
                required
                label={'AIS最低提现个数'}
                field={'AIS_LOW_WITHDRAW'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                required
                rules={[{ required: true }]}
                label={'AIS提现手续费（固额）'}
                extra="每次提现扣除手续费，计费方式AIS固定额度"
                field={'AIS_LOW_WITHDRAW_FEE'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                required
                label={'AIS提现自动审核通过最小个数'}
                field={'AIS_CHECK_MINXM'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                label={'AIS提现开放时间'}
                rules={[{ required: true }]}
                field={'AIS_WITHDRAW_OPEN_TIME'}
              >
                <RangePicker
                  style={{ width: 360 }}
                  showTime={{
                    defaultValue: ['00:00', '00:00'],
                    format: 'HH:mm',
                  }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
              <Form.Item
                required
                label={'AIS提现开关'}
                field={'AIS_WITHDRAW_OPEN_FLAG'}
              >
                <Switch
                  checked={state.aisFlag}
                  onChange={(v) => {
                    setState({
                      ...state,
                      aisFlag: v,
                    });
                  }}
                />
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane key="2" title="USDT提现配置">
            <Form
              onSubmit={saveUsdtWithDrawConfig}
              form={form2}
              style={{ width: '500px' }}
            >
              <Form.Item required label={'私钥'} field={'privateKey'}>
                <Input placeholder={'请输入私钥'}></Input>
              </Form.Item>
              <Form.Item required label={'地址'} field={'address'}>
                <Input placeholder={'请输入地址'}></Input>
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form2.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane key="3" title="USDT归集配置">
            <Form
              form={form3}
              onSubmit={() => saveUsdtCollect(form3, 'setUsdtCollect')}
              style={{ width: '700px' }}
            >
              <Form.Item required label={'USDT归集地址'} field={'address'}>
                <Input placeholder={'请输入USDT归集地址'}></Input>
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form3.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane key="4" title="手续费配置">
            <Form
              form={form4}
              onSubmit={() => saveUsdtCollect(form4, 'setFee')}
              style={{ width: '500px' }}
            >
              <Form.Item required label={'私钥'} field={'privateKey'}>
                <Input placeholder={'请输入私钥'}></Input>
              </Form.Item>
              <Form.Item required label={'地址'} field={'address'}>
                <Input placeholder={'请输入地址'}></Input>
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form4.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane key="5" title="AIS提现配置">
            <Form
              form={form5}
              onSubmit={() => saveUsdtCollect(form5, 'setAisWithDraw')}
              style={{ width: '500px' }}
            >
              <Form.Item required label={'私钥'} field={'privateKey'}>
                <Input placeholder={'请输入私钥'}></Input>
              </Form.Item>
              <Form.Item required label={'地址'} field={'address'}>
                <Input placeholder={'请输入地址'}></Input>
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form5.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane key="6" title="AIS归集配置">
            <Form
              form={form6}
              onSubmit={() => saveUsdtCollect(form6, 'setAisCollect')}
              style={{ width: '700px' }}
            >
              <Form.Item required label={'AIS归集地址'} field={'address'}>
                <Input placeholder={'请输入AIS归集地址'}></Input>
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form6.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane key="7" title="互转配置">
            <Form
              form={form7}
              style={{ width: '700px' }}
              onSubmit={() => saveUsdtCollect(form7, 'setTransferEachOther')}
            >
              <Form.Item
                required
                label={'USDT最低互转数量'}
                field={'USDT_TRANSFER_LOW'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                required
                label={'USDT互转手续费（比例）'}
                extra="每次提现扣除手续费，计费方式USDT固定比例"
                field={'USDT_TRANSFER_FEE'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Divider />
              <Form.Item
                required
                label={'AIS最低互转数量'}
                field={'AIS_TRANSFER_LOW'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item
                required
                label={'AIS互转手续费（比例）'}
                extra="每次提现扣除手续费，计费方式AIS固定比例"
                field={'AIS_TRANSFER_FEE'}
              >
                <InputNumber
                  mode="button"
                  defaultValue={10}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form7.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane key="8" title="AIS销毁配置">
            <Form
              form={form8}
              onSubmit={() => saveUsdtCollect(form8, 'setAisBurn')}
              style={{ width: '500px' }}
            >
              <Form.Item required label={'私钥'} field={'privateKey'}>
                <Input placeholder={'请输入私钥'}></Input>
              </Form.Item>
              <Form.Item required label={'地址'} field={'address'}>
                <Input placeholder={'请输入地址'}></Input>
              </Form.Item>
              <Space style={{ marginLeft: '100px' }}>
                <Button onClick={() => form8.resetFields()}>重置</Button>
                <Button type={'primary'} htmlType="submit">
                  提交
                </Button>
              </Space>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </Spin>
  );
}

export default Configuration;
