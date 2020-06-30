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
import Intro from './Intro.vue'
import { requireAuth } from './js/auth';
import logging from './js/logging';


//*** Error capturing and logging
//vue specific
Vue.config.errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  
  // Perform any custom logic or log to server
  logging.error("Uncaught Vuejs error" + err + " in " + vm + " info " + info);

};

//general errors
window.onerror = function(message, source, lineno, colno, error) {
  logging.error("General error not in vuejs " +  message + source + " Line num" + lineno + " col num " + colno + error);
};



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
  { path: "/intro", component: Intro}
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
