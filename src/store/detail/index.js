import {reqGoodsList,reqAddOrUpdateShopCart} from '@/api/index'
//封装有课身份模块uuid--生成一个随机字符串并且不变
import { getUUID } from '@/utils/uuid_token'
const state = {
    goodinfo:{},
    uuid_token:getUUID()
}
const mutations = {
    GETGOODINFO(state,goodinfo){
        state.goodinfo = goodinfo
    }
}
const actions = {
    async getGoodInfo({commit},skuId){
        let result = await reqGoodsList(skuId)
        if(result.code===200){
            commit('GETGOODINFO',result.data)
        }
    },
    //添加到购物车
    async AddOrUpdateShopCart({commit},{skuId,skuNum}){
        //服务器写入数据成功后并没有返回其他数据，只是返回code==200
        let result = await reqAddOrUpdateShopCart(skuId,skuNum)
        if(result.code == 200){
            return "ok"
        }else{
            return Promise.reject(new Error('fail'))
        }
    },
}
const getters = {
    categoryView(){
        return state.goodinfo.categoryView||{}
    },
    skuInfo(){
        return state.goodinfo.skuInfo||{}
    },
    spuSaleAttrList(){
        return state.goodinfo.spuSaleAttrList||[]
    }
}
export default{
    state,
    mutations,
    actions,
    getters
}