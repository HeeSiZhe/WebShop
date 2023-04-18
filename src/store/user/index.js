import { reqGetCodes, reqRegister,reqUserLogin,reqUserInfo,reqLogOut } from '@/api/index'
import { setToken,getToken,removeToken } from '@/utils/token'

const state = {
  code: '',
  token:getToken(),
  userinfo:{}
}
const mutations = {
  GETCODES(state, code) {
    state.code = code
  },
  USERLOGIN(state,token) {
    state.token = token
  },
  GETUSERINFO(state,userinfo){
    state.userinfo = userinfo
  },
  //清除本地数据
  LOGOUT(state){
    state.token = '',
    state.userinfo = '',
    removeToken()
  }
}
const actions = {
  //获取验证码
  async getCodes({ commit }, phone) {
    let result = await reqGetCodes(phone)
    if (result.code === 200) {
      commit('GETCODES', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },
  //用户注册
  async userRegister({commit},data){
   let result = await reqRegister(data)
   if(result.code === 200){
    return 'ok'
   }else{
    return Promise.reject(result.message)
   }
  },
  //用户登录
  async userLogin({commit},data){
    let result = await reqUserLogin(data)
    //登录后服务器下发token，用户唯一标识符（类似于uuid）
    //将来通过带token找服务器要用户信息进行展示
    /*笔记： 注意一般登录后前台要持久化存储token，但是注意 vuex仓库存储数据不是持久化 */
    if(result.code === 200){
      commit('USERLOGIN',result.data.token)
      //持久化存储token
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(result.message)
    }
  },
  //获取用户信息
  async getUserInfo({commit}) {
    let result = await reqUserInfo()
    if(result.code === 200){
      commit('GETUSERINFO',result.data)
      return 'ok'
    }else{
      return Promise.reject(result.message)
    }
  },
  //退出登录
  async logOut({commit}) {
    let result = await reqLogOut()
    if(result.code === 200){
      commit('LOGOUT')
      return 'ok'
    }else{
      return Promise.reject(result.message)
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