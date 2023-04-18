//引入一级路由
// 不在使用这种方法 使用路由懒加载更高效 import Home from '../pages/Home'
import Search from '../pages/Search'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Detail from '../pages/Detail'
import AddCartSuccess from '../pages/AddCartSuccess'
import ShopCart from '../pages/ShopCart'
import Trade from '../pages/Trade'
import Pay from '../pages/Pay'
import PaySuccess from '../pages/PaySuccess'
import Center from '../pages/Center'
//引入二级路由
import MyOrder from '../pages/Center/myOrder'
import GroupOrder from '../pages/Center/groupOrder'

export default [
    {
        path:'/center',
        component:Center,
        meta:{show:true},
        children:[
            {
                path:'myorder',
                component:MyOrder
            },
            {
                path:'grouporder',
                component:GroupOrder
            },
            {
                path:'/center',
                redirect:'/center/myorder'
            }
        ]
    },
    {
        path:'/paysuccess',
        component:PaySuccess,
        meta:{show:true}
    },
    {
        path:'/pay',
        component:Pay,
        meta:{show:true},
        beforeEnter: (to, from, next) => {
            if(from.path == '/trade'){
                next()
            }else{
                next(false)
            }
        }
    },
    {
        path:'/trade',
        component:Trade,
        meta:{show:true},
        //路由独享守卫
        //只有从 购物车 来的才能进 填写订单信息
        beforeEnter: (to, from, next) => {
            if(from.path == '/shopcart'){
                next()
            }else{
                //其他地方来的一律保留在原地
                next(false)
            }
        }
    },
    {
        path:'/shopcart',
        component:ShopCart,
        meta:{show:true}
    },
    {
        path:'/addcartsuccess',
        name:'addcartsuccess',
        component:AddCartSuccess,
        meta:{show:true}
    },
    {
        path:'/detail/:skuId',
        component:Detail,
        meta:{show:true}
    },
    {
        path:'/home',
        component:() => import('@/pages/Home'),
        meta:{show:true}
    },
    {
        path:'/search/:keyword?',
        component:Search,
        meta:{show:true},
        name:'search',
        //布尔值写法:params
        // props:true
        //对象写法（额外的给路由组件传递一些props）
        // props:{a:'saj'}
        //函数写法:可以params参数、query参数通过props传递给路由组件
        // props:($route) => ({k:$route.params.k,otherK:$route.query.otherK})
    },
    {
        path:'/login',
        component:Login,
        meta:{show:false}
    },
    {
        path:'/register',
        component:Register,
        meta:{show:false}
    },
    //重定向
    {
        path:'*',
        redirect:'/home'
    }
]