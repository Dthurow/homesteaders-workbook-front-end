import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Plants from './Plants.vue'
import Gardens from './Gardens.vue'
import Home from './Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home},
  { path: '/plants', component: Plants },
  { path: '/gardens', component: Gardens }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
