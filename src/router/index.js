import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

const Shop = resolve => require(['../pages/Shop/shop'], resolve);
const Order = resolve => require(['../pages/Order/order'], resolve);

Vue.use(Router)

const router = new Router({
  // mode:'history',
  routes: [
    {
      path: '/shop',
      name: 'shop',
      component: Shop
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(!to.name){
    next({ name: 'shop' })
  } else {
    next()
  }

})

export default router
