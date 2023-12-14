import React, { useState } from 'react';
import { Card, Spin, Tabs } from '@arco-design/web-react';
import WithdrawComponents from '@/pages/list/help-table/components/withComponents';
import RechargeComponents from '@/pages/list/help-table/components/rechargeComponents';
import MutualismComponents from '@/pages/list/help-table/components/mutualismComponents';
import ConvertComponents from '@/pages/list/help-table/components/convertComponents';
import ImputationComponents from '@/pages/list/help-table/components/imputationComponents';
import AISDestructionComponents from '@/pages/list/help-table/components/aisDestructionComponents';

const AmountManagement = () => {
  const [pageLoading, setPageLoading] = useState(false);

  return (
    <Spin style={{ width: '100%' }} loading={pageLoading}>
      <Card>
        <Tabs defaultActiveTab="1">
          <Tabs.TabPane key="1" title="提现配置">
            <WithdrawComponents></WithdrawComponents>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" title="充值列表">
            <RechargeComponents></RechargeComponents>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" title="资金明细">
            <MutualismComponents></MutualismComponents>
          </Tabs.TabPane>
          <Tabs.TabPane key="4" title="互转记录">
            <ConvertComponents></ConvertComponents>
          </Tabs.TabPane>
          <Tabs.TabPane key="5" title="归集记录">
            <ImputationComponents></ImputationComponents>
          </Tabs.TabPane>
          <Tabs.TabPane key="6" title="AIS销毁记录">
            <AISDestructionComponents></AISDestructionComponents>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Spin>
  );
};

export default AmountManagement;
