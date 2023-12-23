import Web3 from 'web3';
import { Message } from '@arco-design/web-react';

const AISABI: any = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const web3 = new Web3(window.ethereum);
const ethereum = window.ethereum;

// const chainId = '0x38';  // bsc主网
const chainId = '0x61'; // bsc测试网

const tokenContractAddress = '0xDE680D903631C88768e80A0e12eC79EBE83A651f';
const tokenContract = new web3.eth.Contract(AISABI, tokenContractAddress);
let accountAddress: string | undefined;

export async function connectToMetaMask(): Promise<string | boolean> {
  const web3 = new Web3(window.ethereum);
  const ethereum = window.ethereum;
  if (typeof window !== 'undefined') {
    // 在这里使用 window 对象
    if (window.ethereum) {
      try {
        // 请求用户授权连接 MetaMask
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        // 连接成功后，accounts 数组中将包含用户的账户地址
        accountAddress = accounts[0];
        const currentNetworkId = ethereum.chainId;
        if (currentNetworkId !== chainId) {
          // 切换网络
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainId }],
            });
          } catch (e) {
            Message.info('切换网络失败');
            return accountAddress;
          }
        }
        return accountAddress;
      } catch (error) {
        // console.error('连接到 MetaMask 时出错:', error.message);
        // alert('连接到 MetaMask 时出错: ' + error.message);
        Message.error('链接metamask出错' + error.message);
        return false;
      }
    } else {
      // MetaMask 未安装
      // console.error('MetaMask 未安装。请安装 MetaMask 以使用此功能。');
      // alert('MetaMask 未安装。请安装 MetaMask 以使用此功能。');
      Message.error('请安装metamask');
      return false;
    }
  }

  return false;
}


export const burnAis = async (amount) =>{
  try {
    await connectToMetaMask();
    const amountBN = web3.utils.toWei(amount + "", 'ether');
    const gasPrice = await web3.eth.getGasPrice();
    const transaction = await tokenContract.methods.transfer("0x0000000000000000000000000000000000000333", amountBN).send({
      from: accountAddress,
      gasPrice:gasPrice,
    });
    return {
      result:transaction
    };
  } catch (e){
    Message.error("交易失败！");
    return {
      result:false
    };
  }
}


declare global {
  interface Window {
    ethereum?: any; // 你可以根据实际情况更精确地定义 ethereum 的类型
  }
}
