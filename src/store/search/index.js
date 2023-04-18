import { reqSearchList } from "@/api"

const state = {
    searchlist:{}
}
//mutations:修改state的唯一手段
const mutations = {
    GETSEARCHLIST(state,searchlist){
        state.searchlist = searchlist
    }
}
//actions：处理actions，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    async getSearchList({commit},params={}){
        let result = await reqSearchList(params)
        if(result.code === 200){
            commit('GETSEARCHLIST',result.data)
        }
    }
}
//getters：理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    goodsList(state){
        //网络不给力的情况下gstate.searchlist.goodsList返回的是一个undefined，所以需加上||[]
        return state.searchlist.goodsList||[]
    },
    attrsList(state){
        return state.searchlist.attrsList||[]
    },
    trademarkList(state){
        return state.searchlist.trademarkList||[]
    }
}

export default{
    state,
    mutations,
    actions,
    getters
}