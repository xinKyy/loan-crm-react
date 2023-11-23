import axios from './axios_instance';

// 获取帮助订单列表
export const getHelpOrderList = (params) => {
  return axios.post('/api/v1/iccOrder/getPageList', params);
};

// 获取基金订单列表
export const APIGetCCOrderList = (params) => {
  return axios.post('/api/v1/ccOrder/getChargeOrderList', params);
};

// 登录
export const APIDoLogin = (params) => {
  return axios.post('/adminUser/doLogin', params);
};

// 获取匹配订单列表
export const getMatchOrderList = (params) => {
  return axios.post('/api/v1/iccOrder/getAbleMatchList', params);
};

// 获取后台差额补足账户地址
export const APIGetConfigAddress = (params) => {
  return axios.get('/api/v1/config/getConfigAddress', { params });
};

// 获取后台账户地址
export const APIGetConfigListRsp = (params) => {
  return axios.get('/api/v1/config/getConfigListRsp', { params });
};

// 配置后台差额补足账户地址
export const APIComplementAddress = (params) => {
  return axios.get('/api/v1/config/complementAddress', { params });
};

// 配置探索基金地址
export const APISearchFundsAddress = (params) => {
  return axios.get('/api/v1/config/searchFunds', { params });
};

// 配置保本基金地址
export const APIGrantFundsAddress = (params) => {
  return axios.get('/api/v1/config/grantFunds', { params });
};

// 配置共识基金地址
export const APIPosFundsAddress = (params) => {
  return axios.get('/api/v1/config/posFunds', { params });
};

// 备注帮助订单
export const APIEditLccOrderNote = (params) => {
  return axios.post('/api/v1/iccOrder/orderNote', params);
};

// 备注基金订单
export const APIEditCCOrderNote = (params) => {
  return axios.post('/api/v1/ccOrder/orderNote', params);
};

// 匹配帮助订单
export const APIMatchOrder = (params) => {
  return axios.post('/api/v1/iccOrder/match', params);
};

// 获取订单操作记录  type:0 基金订单操作记录，1：帮助订单操作记录
export const APIOrderActionLog = (params) => {
  return axios.get('/api/v1/orderOperateRecord/getOrderRecordList', { params });
};

// 审批基金订单
export const APIAcceptOrder = (params) => {
  return axios.get('/api/v1/ccOrder/check', { params });
};

// 发布文章
export const APICreatePost = (params) => {
  return axios.post('/api/v1/notice/saveNotice', params);
};

// 文章列表
export const APIPostList = (params) => {
  return axios.get('/api/v1/notice/getList', { params });
};

// 修改文章状态
export const APIChangStatePost = (params) => {
  return axios.get('/api/v1/notice/setStatus', { params });
};

// 获取文章详情
export const APIGetPostDetail = (params) => {
  return axios.get('/api/v1/notice/getDetail', { params });
};

// 获取轮播图
export const APIGetBannerList = (params) => {
  return axios.get('/api/v1/banner/listBanner', { params });
};

// 创建轮播图
export const APICreateBanner = (params) => {
  return axios.post('/api/v1/banner/postBanner', params);
};
