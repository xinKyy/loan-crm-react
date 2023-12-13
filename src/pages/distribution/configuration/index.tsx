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
} from '@arco-design/web-react';
import styles from './index.module.less';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
function Configuration() {
  return (
    <Card>
      <Tabs defaultActiveTab="1">
        <TabPane key="1" title="提现配置">
          <Form>
            <Form.Item required label={'USDT最低提现个数'}>
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item
              required
              label={'USDT提现手续费（固额）'}
              extra="每次提现扣除手续费，计费方式USDT固定额度"
            >
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item required label={'USDT提现自动审核通过最小个数'}>
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item label={'USDT提现开放时间'}>
              <RangePicker
                style={{ width: 360 }}
                showTime={{
                  defaultValue: ['00:00', '00:00'],
                  format: 'HH:mm',
                }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
            <Form.Item required label={'USDT提现开关'}>
              <Switch />
            </Form.Item>
            <Divider />
            <Form.Item required label={'AIS最低提现个数'}>
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item
              required
              label={'AIS提现手续费（固额）'}
              extra="每次提现扣除手续费，计费方式AIS固定额度"
            >
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item required label={'AIS提现自动审核通过最小个数'}>
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Form.Item label={'AIS提现开放时间'}>
              <RangePicker
                style={{ width: 360 }}
                showTime={{
                  defaultValue: ['00:00', '00:00'],
                  format: 'HH:mm',
                }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
            <Form.Item required label={'AIS提现开关'}>
              <Switch />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key="2" title="USDT提现配置">
          <Form style={{ width: '500px' }}>
            <Form.Item required label={'私钥'}>
              <Input placeholder={'请输入私钥'}></Input>
            </Form.Item>
            <Form.Item required label={'地址'}>
              <Input placeholder={'请输入地址'}></Input>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key="3" title="USDT归集配置">
          <Form style={{ width: '700px' }}>
            <Form.Item required label={'USDT归集地址'}>
              <Input placeholder={'请输入USDT归集地址'}></Input>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key="4" title="手续费配置">
          <Form style={{ width: '500px' }}>
            <Form.Item required label={'私钥'}>
              <Input placeholder={'请输入私钥'}></Input>
            </Form.Item>
            <Form.Item required label={'地址'}>
              <Input placeholder={'请输入地址'}></Input>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key="5" title="AIS提现配置">
          <Form style={{ width: '500px' }}>
            <Form.Item required label={'私钥'}>
              <Input placeholder={'请输入私钥'}></Input>
            </Form.Item>
            <Form.Item required label={'地址'}>
              <Input placeholder={'请输入地址'}></Input>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key="6" title="AIS归集配置">
          <Form style={{ width: '700px' }}>
            <Form.Item required label={'AIS归集地址'}>
              <Input placeholder={'请输入AIS归集地址'}></Input>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key="7" title="互转配置">
          <Form>
            <Form.Item required label={'USDT最低互转数量'}>
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
            >
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Divider />
            <Form.Item required label={'AIS最低互转数量'}>
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
            >
              <InputNumber
                mode="button"
                defaultValue={10}
                style={{ width: 160 }}
              />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key="8" title="AIS销毁配置">
          <Form style={{ width: '500px' }}>
            <Form.Item required label={'私钥'}>
              <Input placeholder={'请输入私钥'}></Input>
            </Form.Item>
            <Form.Item required label={'地址'}>
              <Input placeholder={'请输入地址'}></Input>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default Configuration;
