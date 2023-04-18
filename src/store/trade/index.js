import { reqUserAddress, reqUserOrder } from "@/api"
const state = {
    userAddress: [],
    order:{}
}
const mutations = {
    GETUSERADDRESS(state, userAddress) {
        state.userAddress = userAddress
    },
    GETUSERORDER(state,order){
        state.order = order
    }
}
const actions = {
    //获取用户地址
    async getUserAddress({commit}){
        let result = await reqUserAddress()
        if(result.code == 200){
            commit('GETUSERADDRESS',result.data)
        }
    },
    //获取订单信息
    async getUserOrder({commit}){
        let result = await reqUserOrder()
        if(result.code == 200){
            commit('GETUSERORDER',result.data)
        }
    }

}
const getters = {

}
export default {
    state,
    mutations,
    actions,
    getters
}