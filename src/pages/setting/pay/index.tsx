import React, { useState, useEffect, useMemo } from 'react';
import {Button, Card, Input, InputNumber, Switch, Tabs} from '@arco-design/web-react';
import styles from './index.module.less';
const TabPane = Tabs.TabPane;
function Configuration() {
  return (
    <Card style={{ height: '75vh' }}>
      <Tabs defaultActiveTab="1">
        <TabPane key="1" title="差额账户配置">
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>钱包余额
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input disabled placeholder={"请输入钱包余额"}></Input>
            </div>
          </div>


          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>钱包私钥
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包私钥"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                用于后台操作匹配提供帮助订单时，匹配的差额补足账户的私钥
              </div>
            </div>
          </div>


          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>钱包地址
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包地址"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                用于后台操作匹配提供帮助订单时，匹配的差额补足账户的钱包地址
              </div>
            </div>
          </div>

          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>差额补足启用
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Switch />
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                差额补足功能是否开启。开启时会显示配置账户，关闭时不会显示配置账户
              </div>
            </div>
          </div>

          <div style={{ height: 50 }}></div>
          <Button type={"primary"} style={{width:200, marginLeft:50}}>提交</Button>
        </TabPane>
        <TabPane key="2" title="探索基金配置">
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '130px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>钱包私钥
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包私钥"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                自动转入的探索基金地址的钱包私钥
              </div>
            </div>
          </div>


          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '130px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>探索基金钱包地址
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包地址"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                自动转入的探索基金地址的钱包私钥
              </div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>自动转入比例</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单支付成功后自动给探索基金地址转入的比例，例:0.5 = 返订单金额的50%
              </div>
            </div>
          </div>

          <div style={{ height: 50 }}></div>
          <Button type={"primary"} style={{width:200, marginLeft:50}}>提交</Button>
        </TabPane>
        <TabPane key="3" title="保本基金配置">
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '130px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>钱包私钥
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包私钥"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                自动转入的保本基金地址的钱包私钥
              </div>
            </div>
          </div>


          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '130px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>保本基金钱包地址
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包地址"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                自动转入的保本基金地址的钱包私钥
              </div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>自动转入比例</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单支付成功后自动给保本基金地址转入的比例，例:0.5 = 返订单金额的50%
              </div>
            </div>
          </div>

          <div style={{ height: 50 }}></div>
          <Button type={"primary"} style={{width:200, marginLeft:50}}>提交</Button>
        </TabPane>
        <TabPane key="4" title="共识基金配置">
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '130px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>钱包私钥
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包私钥"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                自动转入的共识基金地址的钱包私钥
              </div>
            </div>
          </div>


          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '130px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>共识基金钱包地址
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input  placeholder={"请输入钱包地址"}></Input>
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                自动转入的共识基金地址的钱包地址
              </div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>自动转入比例</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单支付成功后自动给共识基金地址转入的比例，例:0.5 = 返订单金额的50%
              </div>
            </div>
          </div>

          <div style={{ height: 50 }}></div>
          <Button type={"primary"} style={{width:200, marginLeft:50}}>提交</Button>
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default Configuration;
