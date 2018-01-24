import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

const Shop = resolve => require(['../pages/Shop'], resolve);

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/shop',
      name: 'shop',
      component: Shop
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
