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

// 管理员列表
export const APIGetAdminUserList = (params) => {
  return axios.post('/adminUser/listUser', params);
};

// 创建管理员
export const APICreateAdminUser = (params) => {
  return axios.post('/adminUser/addUser', params);
};

// 删除管理员
export const APIDeleteAdminUser = (params) => {
  return axios.get('/adminUser/deleteUser', { params });
};

// 修改管理员密码
export const APIEditAdminUserPassword = (params) => {
  return axios.get('/adminUser/resetPassword', { params });
};

// 首页数据
export const APIHome = (params) => {
  return axios.get('/api/v1/iccOrder/home', { params });
};

// 获取用户列表
export const APIGetUserList = (params) => {
  return axios.get('/adminUser/getUser2', { params });
};

// 获取会员等级列表
export const APIGetVipList = (params) => {
  return axios.get('/api/v1/vip/list', { params });
};

// 更改会员等级
export const APIEditVipList = (params) => {
  return axios.post('/api/v1/vip/update', params);
};

// 修改用户详情
export const APIEditUser = (params) => {
  return axios.get('/adminUser/getUser', { params });
};

// 修改用户密码
export const APIEditUserPassword = (params) => {
  return axios.get('/adminUser/api/updatePass', { params });
};

// 修改用户cc余额
export const APIEditUserCCBalance = (params) => {
  return axios.get('/adminUser/api/getUser', { params });
};

// 设置-得到账户列表
export const APIGetHelpList = (params) => {
  return axios.get('/adminUser/listBackUser', { params });
};

// 设置-提供帮助订单列表
export const APIGetOfferOrderList = (params) => {
  return axios.post('/api/v1/iccOrder/getAdminOfferOrder', params);
};

// 设置-匹配帮助订单
export const APIMatchAdminOrder = (params) => {
  return axios.post('/api/v1/iccOrder/backMatchOfferOfer', params);
};

// 设置-创建后台匹配账户
export const APICreateBackUser = (params) => {
  return axios.get('/adminUser/addBackUser', { params });
};

// 设置-获取匹配记录
export const APIGetListBackOrder = (params) => {
  return axios.get('/api/v1/iccOrder/listBackOrders', { params });
};

// 删除后台匹配账户
export const APIDeleteBackUser = (params) => {
  return axios.get('/adminUser/removeBackUser', { params });
};

// 订单疑问审核
export const APIConfirmQuestion = (params) => {
  return axios.get('/api/v1/iccOrder/checkListBackOrdersForCheck', { params });
};

// 获取后台审核订单列表
export const APIGetBackList = (params) => {
  return axios.get('/api/v1/iccOrder/listBackOrdersForCheck', { params });
};

//// 此处开始为 ais后台接口

// 设置配置项
export const APISetWithDrawConfig = (params) => {
  return axios.get('/api/v1/sysConfig/setWithDrawConfig', { params });
};

export const APIGetWithDrawConfig = (params) => {
  return axios.get('/api/v1/sysConfig/getWithdrawConfig', { params });
};

export const APISetUsdtWithDrawConfig = (params) => {
  return axios.get('/api/v1/sysConfig/setUsdtWithDrawConfig', { params });
};
export const APIGetUsdtWithDrawConfig = (params) => {
  return axios.get('/api/v1/sysConfig/getUsdtWithDrawConfig', { params });
};

export const APISetUsdtCollect = (params, url) => {
  return axios.get(`/api/v1/sysConfig/${url}`, { params });
};

export const APIGetChargeRecord = (params, url) => {
  return axios.post(`/api/v1/assert/${url}`, params);
};

export const APISetAISPrice = (params) => {
  return axios.get(`/api/v1/aisConfig/setPrice`, { params });
};

export const APIGetAISPrice = (params) => {
  return axios.get(`/api/v1/aisConfig/getPrice`, { params });
};

export const APIAddScheduled = (params) => {
  return axios.post(`/api/v1/aisConfig/addScheduled`, params);
};
export const APIGetUsersList = (params) => {
  return axios.post(`/api/v1/adminUser/getUserLists`, params);
};
export const APIChangeUserStatus = (params) => {
  return axios.get(`/api/v1/adminUser/setStatus`, { params });
};
