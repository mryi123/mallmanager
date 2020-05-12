import Vue from 'vue'
import Router from 'vue-router'
import AppLogin from '@/components/AppLogin'
import AppHome from '@/components/AppHome'
import AppRights from '@/components/roles/AppRights'
import AppWelcome from '@/components/users/AppWelcome'
import AppRoles from '@/components/roles/AppRoles'
import AppGoodsAdd from '@/components/goods/AppGoodsAdd'
import AppGoodsEdit from '@/components/goods/AppGoodsEdit'
import AppGoodsList from '@/components/goods/AppGoodsList'
import AppGoodsParams from '@/components/goods/AppGoodsParams'
import Appcategories from '@/components/goods/Appcategories'
import Apporders from '@/components/order/Apporders'
import Appreports from '@/components/reports/Appreports'

import VueRouter from 'vue-router'
import { Message } from 'element-ui'


Vue.use(Router)

const router=new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AppLogin,
    },
    {
      path:'/',
      name:'home',
      component:AppHome,
      children:[{
        path:'/users',
        name:'welcome',
        component:AppWelcome
      },{
        path:'/rights',
        name:'rights',
        component:AppRights
      },{
        path:'/roles',
        name:'roles',
        component:AppRoles
      },{
        path:'/goods',
        name:'goods',
        component:AppGoodsList
      },{
        path:'/goodsadd',
        name:'goodsadd',
        component:AppGoodsAdd
      },{
        path:'/goodsedit',
        name:'goodsedit',
        component:AppGoodsEdit
      },{
        path:'/params',
        name:'params',
        component:AppGoodsParams
      },{
        path:'/categories',
        name:'categories',
        component:Appcategories
      },{
        path:'/orders',
        name:'orders',
        component:Apporders
      },{
        path:'/reports',
        name:'reports',
        component:Appreports
      }]
    }
  ]
})

//添加路由守卫
router.beforeEach((to,from,next)=>{
  if(to.name==='login'){
    console.log('拦截');
    next()
  }else{
    let token = localStorage.getItem("token");
    if (!token) {
      //是空 没有登录
      //跳转登录页面
      router.push({ name: "login" });
      Message.warning("请先登录");  
  }
}
next()
})

export default router