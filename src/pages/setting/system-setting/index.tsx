import React, { useState, useEffect, useMemo } from 'react';
import {Card, Input, InputNumber, Switch, Tabs} from '@arco-design/web-react';
import styles from './index.module.less';
const TabPane = Tabs.TabPane;
function Configuration() {
  return (
    <Card style={{ height: '75vh' }}>
      <Tabs defaultActiveTab="1">
        <TabPane key="1" title="系统信息">
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>网站启用
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Switch />
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>网站域名
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input placeholder={"请输入网站域名"}></Input>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>网站名称
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Input placeholder={"请输入网站名称"}></Input>
            </div>
          </div>
        </TabPane>
        <TabPane key="2" title="交易设置">
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>订单自动关闭时间</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单提交后待支付时长
              </div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>系统匹配时间</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单提交后待匹配时长
              </div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div className={styles.row_flex}>
            <div className={styles.left}>佣金冻结周期</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                冻结期从用户获得返佣时(确认收货后)开始计算，如设置5天，即确认收货5天后，佣金解冻可提现；如设置0天，则无冻结期
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default Configuration;
