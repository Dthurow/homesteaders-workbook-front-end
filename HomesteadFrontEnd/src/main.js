import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Plants from './Plants.vue'
import Gardens from './Gardens.vue'
import Home from './Home.vue'
import Garden from './Garden.vue'
import PersonPlants from './PersonPlants.vue'
import Callback from './Callback.vue'
import { requireAuth } from './js/auth';

Vue.use(VueRouter)

const routes = [
  { path: '/plants', component: Plants, beforeEnter: requireAuth, },
  { path: '/gardens', component: Gardens, beforeEnter: requireAuth, },
  { path: '/garden/:id', component: Garden, props: true, beforeEnter: requireAuth, },
  { path: '/callback', component: Callback },
  { path: '/', component: Home },
]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
