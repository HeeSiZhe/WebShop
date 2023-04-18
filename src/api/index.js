//当前模块：API接口进行统一管理
import requests from "./request";
import mockRequests from "./mockRequest"

//三级联动接口
export const reqCategoryList = () => {
    return requests({
        url: '/product/getBaseCategoryList',
        method: 'get'
    })
}

//获取首页banner轮播图接口
export const reqBannerList = () => {
    return mockRequests({
        url: '/banner',
        method: 'get'
    })
}

//获取首页banner轮播图接口
export const reqFloorList = () => {
    return mockRequests({
        url: '/floor',
        method: 'get'
    })
}

//获取search列表接口
export const reqSearchList = (params) => {
    return requests({ url: '/list', method: 'post', data: params })
}

//获取详情数据
export const reqGoodsList = (skuId) => {
    return requests({ url: `/item/${skuId}`, method: 'get' })
}

//添加到购物车(对已有物品进行数量改动)
// /api/cart/addToCart/{ skuId }/{ skuNum }
export const reqAddOrUpdateShopCart = (skuId,skuNum) => {
    return requests({url:`/cart/addToCart/${skuId}/${skuNum}`,method:'post'})
}

//获取购物车列表
export const reqCartList = () => {
    return requests({url:'/cart/cartList',method:'get'})
}

//删除购物车里的商品
///api/cart/deleteCart/{skuId}
export const reqDeleteCartById = (skuId) => {
    return requests({url:`/cart/deleteCart/${skuId}`,method:'delete'})
}

//切换产品状态
export const reqCheckCart = ({skuId,isChecked}) => {
    return requests({url:`/cart/checkCart/${skuId}/${isChecked}`})
}

//获取验证码
export const reqGetCodes = (phone) => {
    return requests({url:`/user/passport/sendCode/${phone}`,method:'get'})
}

//注册用户
export const reqRegister = (data) => {
    return requests({url:'/user/passport/register',data,method:'post'})
}

//用户登录
export const reqUserLogin = (data) => {
    return requests({url:'/user/passport/login',data,method:'post'})
}

//带token获取用户信息
export const reqUserInfo = () => {
    return requests({url:'/user/passport/auth/getUserInfo',method:'get'})
}

//退出登录
export const reqLogOut = () => {
    return requests({url:'/user/passport/logout',method:'get'})
}

//获取用户地址信息
export const reqUserAddress = () => {
    return requests({url:'/user/userAddress/auth/findUserAddressList',method:'get'})
}

//获取交易页信息
export const reqUserOrder = () => {
    return requests({url:'/order/auth/trade',method:'get'})
}

//提交订单信息
export const reqSubmitOrder = (tradeNo,data) => {
    return requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})
}

//获取订单支付信息 /api/payment/weixin/createNative/{orderId}
export const reqPayInfo = (orderId) => {
    return requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'})
}

//查询支付订单状态 /api/payment/weixin/queryPayStatus/{orderId}
export const reqPayStatus = (orderId) => {
    return requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})
}

//获取我的订单列表 /api/order/auth/{page}/{limit}
export const reqMyOrder = (page,limit) => {
    return requests({url:`/order/auth/${page}/${limit}`,method:'get'})
}