import {reqCartList,reqDeleteCartById,reqCheckCart} from '@/api/index'
const state = {
    cartList:[]
}
const mutations = {
    GETCARTLIST(state,cartList){
        state.cartList = cartList
    }
}
const actions = {
    //获取购物车列表
    async getCartList({commit}){
        let result = await reqCartList()
        if(result.code === 200){
            commit('GETCARTLIST',result.data)
        }
    },
    //删除购物车里的商品
    async deleteCartList({commit},skuId){
        let result = await reqDeleteCartById(skuId)
        if(result.code === 200){
            return('ok')
        }else{
            return Promise.reject(new Error('fail'))
        }
    },
    //改变商品勾选状态
    async changeCheckCart({commit},{skuId,isChecked}){
        let result = await reqCheckCart({skuId,isChecked})
        if(result.code === 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    },
    //删除被选中的所有商品
    deleteCartChecked({dispatch,getters}){
        let cartChecked = getters.cartList.cartInfoList
        let prAll = []
        cartChecked.forEach(item => {
            /*1.因为没有删除所有商品的接口，所有在actions里面调用单独删除的接口一个一个删，遍历getters里面的商品，
            Id作为参数派发给deleteCartList。
            2.调用deleteCartList的结果是一个promise对象，
            所以要全部所有遍历的结果都是成功的promise就要调用Promise.all方法(参数为数组形式)。*/
          let promise = item.isChecked==1 ?  dispatch('deleteCartList',item.skuId) :''
          prAll.push(promise)
        });
        //Promise.all 数组参数全部为成功的promise，其自身才能返回一个成功的promise
        return Promise.all(prAll)
    },
    //全选操作
    updateAllCartChecked({dispatch,state},isChecked){
        let prAll = []
        state.cartList[0].cartInfoList.forEach(item => {
            //传入全选按钮的isChecked状态并将其作为参数传给changeCheckCart，这样一来所有商品的isChecked状态都和全选按钮的一样了
           let promise = dispatch('changeCheckCart',{skuId:item.skuId,isChecked})
           prAll.push(promise)
        })
        return Promise.all(prAll)
    }
}
const getters = {
    cartList(){
        return state.cartList[0] || {}
    }
}
export default{
    state,
    mutations,
    actions,
    getters
}