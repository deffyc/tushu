import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/zh-CN/category/keywords',
    name: 'home'
  },
  {
    path: '/:lang',
    name: 'lang',
    redirect: '/zh-CN/category/keywords',
    children: [
      {
        path: '/:lang/category',
        name: 'categoryno'
      },
      {
        path: '/:lang/category/keywords',
        name: 'categorykeywords'
      },
      {
        path: '/:lang/book',
        name: 'bookno'
      },
      {
        path: '/:lang/book/keywords',
        name: 'bookkeywords'
      }
    ]
  },
  { path: '*', redirect: '/' }
]
const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
})

export default router
