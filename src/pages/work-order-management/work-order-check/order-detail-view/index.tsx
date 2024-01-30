import React from "react";
import dynamic from "next/dynamic";
const OrderDetailView = dynamic(() => import('@/pages/work-order-management/work-order-check/order-detail-view/detail'), { ssr: false });
const OrderDetailViewIndex = () => {
  return (
    <>
      <OrderDetailView/>
    </>
  );
};

export default OrderDetailViewIndex;
