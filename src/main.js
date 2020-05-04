import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Plants from './Plants.vue'
import Gardens from './Gardens.vue'
import Home from './Home.vue'
import Garden from './Garden.vue'
import PlantGroups from './PlantGroups.vue'
import GardenPlant from './GardenPlant.vue'
import Callback from './Callback.vue'
import About from './About.vue'
import { requireAuth } from './js/auth';

Vue.use(VueRouter)

const routes = [
  { path: '/seedchest', component: Plants, beforeEnter: requireAuth, },
  { path: '/gardens', component: Gardens, beforeEnter: requireAuth, },
  { path: '/garden/:id', component: Garden, props: true, beforeEnter: requireAuth, },
  { path: '/gardenplant/:id', component: GardenPlant, props: true, beforeEnter: requireAuth, },
  { path: '/plantgroups', component: PlantGroups, beforeEnter: requireAuth, },
  { path: '/callback', component: Callback },
  { path: '/', component: Home },
  { path: '/about', component: About },
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
