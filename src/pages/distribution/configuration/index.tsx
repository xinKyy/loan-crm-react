import React, { useState, useEffect, useMemo } from 'react';
import { Card, InputNumber, Switch, Tabs } from '@arco-design/web-react';
import styles from './index.module.less';
const TabPane = Tabs.TabPane;
function Configuration() {
  return (
    <Card style={{ height: '75vh' }}>
      <Tabs defaultActiveTab="1">
        <TabPane key="1" title="分销设置">
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>分销启用
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Switch checked={true} />
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                开启：分销功能启用； 关闭：分销功能不可用
              </div>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div
            style={{ display: 'flex', width: '400px', alignItems: 'center' }}
          >
            <div style={{ width: '100px', textAlign: 'end' }}>
              <span style={{ color: 'red' }}>*</span>分佣烧伤启用
            </div>
            <div style={{ flex: '1', marginLeft: '30px' }}>
              <Switch checked={true} />
              <div style={{ fontSize: 12, zoom: '0.8' }}>
                开启：奖金烧伤功能启用； 关闭：奖金烧伤功能不可用
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane key="2" title="返佣设置">
          <div className={styles.row_flex}>
            <div className={styles.left}>一级分销启用比例</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单支付成功后给上级返佣的比例，例:0.5 = 返订单金额的50%
              </div>
            </div>
          </div>
          <div className={styles.row_flex}>
            <div className={styles.left}>一级2到6代启用比例</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单支付成功后给上级返佣的比例，例:0.5 = 返订单金额的50%
              </div>
            </div>
          </div>
          <div className={styles.row_flex}>
            <div className={styles.left}>一级7到20代启用比例</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单支付成功后给上级返佣的比例，例:0.5 = 返订单金额的50%
              </div>
            </div>
          </div>
          <div className={styles.row_flex}>
            <div className={styles.left}>无限级启用比例</div>
            <div className={styles.right}>
              <InputNumber
                mode="button"
                defaultValue={0}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
              <div className={styles.text}>
                订单支付成功后给上级返佣的比例，例:0.5 = 返订单金额的50%
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default Configuration;
