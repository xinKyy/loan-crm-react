import React, { useState } from 'react';
import { Card, Spin, Tabs } from '@arco-design/web-react';
import LpLogsCompon from '@/pages/lp-managment/compon/lpLogsCompon';
import LpUserLogsCompon from '@/pages/lp-managment/compon/lpUserLogsCompon';
import LpGiftCompon from '@/pages/lp-managment/compon/lpGiftCompon';

const AmountManagement = () => {
  const [pageLoading, setPageLoading] = useState(false);

  return (
    <Spin style={{ width: '100%' }} loading={pageLoading}>
      <Card>
        <Tabs defaultActiveTab="1">
          <Tabs.TabPane key="1" title="提现配置">
            <LpLogsCompon></LpLogsCompon>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" title="LP用户列表">
            <LpUserLogsCompon></LpUserLogsCompon>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" title="LP分红列表">
            <LpGiftCompon></LpGiftCompon>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Spin>
  );
};

export default AmountManagement;
