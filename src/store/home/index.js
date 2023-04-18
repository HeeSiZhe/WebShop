import {reqBannerList, reqCategoryList, reqFloorList} from '@/api'

//state：仓库存储数据的地方
const state = {
    ListData:[],
    BannerList:[],
    FloorList:[]
}
//mutations:修改state的唯一手段
const mutations = {
    CATELIST(state,ListData){
        state.ListData = ListData
    },
    GETBANNERLIST(state,BannerList){
        state.BannerList = BannerList
    },
    GETFLOORLIST(state,FloorList){
        state.FloorList = FloorList
    }
}
//actions：处理actions，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    async CateList({commit}){
        let result = await reqCategoryList()
        if(result.code === 200){
            commit('CATELIST',result.data)
        }
    },
    async getBannerList({commit}){
        let result = await reqBannerList()
        if(result.code === 200){
            commit('GETBANNERLIST',result.data)
        }
    },
    async getFloorList({commit}){
        let result = await reqFloorList()
        if(result.code === 200){
            commit('GETFLOORLIST',result.data)
        }
    }
}
//getters：理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    
}

export default{
    state,
    mutations,
    actions,
    getters
}