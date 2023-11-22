import axios from './axios_instance';

export const getHelpOrderList = (params) => {
  return axios.post('/api/v1/iccOrder/getPageList', params);
};

export const APIDoLogin = (params) => {
  return axios.post('/adminUser/doLogin', params);
};
