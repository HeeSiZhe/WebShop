//配置路由
import Vue from "vue";
import VueRouter from "vue-router";
//使用插件
Vue.use(VueRouter);
//引入routes
import routes from "./routes";
//引入store
import store from "@/store";

let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
//重写push方法。
///第一个参数：告诉原来push方法往哪里跳
///第二个参数：成功的回调
///第三个参数：失败的回调
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}
//重写replace方法
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}
//配置路由
let router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { y: 0 }
    }
})

//全局守卫：前置路由守卫(在路由跳转之前进行判断)
router.beforeEach(async (to, from, next) => {
    //获取用户token，有token说明已经登录了
    let token = store.state.user.token
    let name = store.state.user.userinfo.name

    //1层.先看用户有没有token
    if (token) {
        //2层.有token，代表登录了
        if (to.path == '/login' || to.path == '/register') {
            //3层.登录了就不能再跳转至login界面
            next('/home')
        } else {
            //3层.登录了但跳转去除了login的界面
            if (name) {
                //4层.拿得到用户信息在header组件上展示，直接放行
                next()
            } else {
                //4层.拿不到用户信息，在路由跳转之前带着token重新派发获取用户信息的action
                try {
                    //5层.派发actions获取用户信息用于展示
                    await store.dispatch('getUserInfo')
                    next()
                } catch (error) {
                    /*5层.此处如果执行则是获取用户信息dispatch派发不成功，因为派发的前提是请求头上有token参数。
                    所以此处执行说明了token令牌已过期，需要用户重新登录*/
                    //派发此dispatch 先清除前后台所有的用户登录信息
                    store.dispatch('logOut')
                    next('/login')
                }
            }
        }
    } else {
        //2层.没token，没登录，不能去交易相关【trade】、支付相关【pay/paysuccess】、不能去个人中心【center/...】
        //如果去了以上的路径，就跳转至登录页面
        let toPath = to.path
        if(toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1){
            //把未登录时候想去而没有去成的信息存储于地址栏中
            next('/login?redirect='+toPath)
        }else{
            //未登录的情况下除了以上路径其他的游客身份浏览
            next()
        }
    }
})

export default router