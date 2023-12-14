import React, { useState } from 'react';
import { Card, Spin, Tabs } from '@arco-design/web-react';
import AiInvestTableComponents from '@/pages/ai-table/ai-invest-list/components/aiInversetTableComponents';

const AiInvestList = () => {
  const [pageLoading, setPageLoading] = useState(false);

  return (
    <Spin style={{ width: '100%' }} loading={pageLoading}>
      <Card>
        <Tabs defaultActiveTab="1">
          <Tabs.TabPane key="1" title="记录列表">
            <AiInvestTableComponents></AiInvestTableComponents>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Spin>
  );
};

export default AiInvestList;
