import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from './router'
//引入仓库
import store from './store'
//引入全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import { Button, MessageBox } from 'element-ui';
//测试
import { reqCategoryList } from '@/api'
reqCategoryList()
//注册全局组件（三级联动）
Vue.component('TypeNav', TypeNav)
Vue.component('Carousel', Carousel)
Vue.component('Pagination', Pagination)
Vue.component(Button.name, Button);
//引入MockServer.js---mock数据
import "@/mock/mockServer"
//引入swiper样式
import "swiper/css/swiper.css"
//引入所有接口
import * as API from '@/api'

Vue.config.productionTip = false

//引入插件
import VueLazyload from 'vue-lazyload'
//引入图片
import kk from '@/assets/2.gif'
//注册插件（相当于安装）
Vue.use(VueLazyload, {
  //懒加载图片
  loading: kk,
})

//引入自定义插件
import myPlugins from '@/plugins/myPlugins';
Vue.use(myPlugins,{
    name:'upper'
});

//引入表单校验插件
import "@/plugins/validate";

new Vue({
  render: h => h(App),
  beforeCreate() {
    //注册事件总线，这里的this是vm
    Vue.prototype.$bus = this
    //将所有接口挂载到Vue.prototype上，所有的组件身上便可以调用所有API接口
    Vue.prototype.$API = API
    //按需引入 Element
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
  },
  //注册路由,注册后组件身上都会有$route和$router属性
  router,
  //注册仓库
  store
}).$mount('#app')
