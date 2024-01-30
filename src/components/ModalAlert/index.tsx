import {Button, Modal} from "@arco-design/web-react";
import React from "react";


const ModalAlert = ({
    visible,
    onCancel,
    refuseFun,
    confirmFun,
    confirmBtn = false,
    confirm2Fun = function (){},
    title,
    body,
   }) =>{

  return   <Modal
    title={title}
    visible={visible}
    onCancel={onCancel}
    hideCancel
    autoFocus={false}
    focusLock={true}
    footer={
      <>
        <Button onClick={refuseFun} type={'default'}>
          取消
        </Button>
        <Button onClick={confirmFun} type={'primary'}>
          确认
        </Button>
        {
          confirmBtn && <Button onClick={confirm2Fun} type={'primary'}>
            还款并结清
          </Button>
        }
      </>
    }
  >
    <p>{body}</p>
  </Modal>
}

export default ModalAlert;
