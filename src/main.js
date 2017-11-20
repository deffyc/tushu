import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import './styles/index.scss'
require('es6-promise').polyfill()

Vue.use(Element, { size: 'mini' })
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.config.productionTip = false

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  render: h => h(App)
})
