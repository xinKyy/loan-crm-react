import axios from './axios_instance';

const getOrderList = () => {
  return axios.get('');
};

export const APIDoLogin = (params) => {
  return axios.post('/adminUser/doLogin', params);
};
