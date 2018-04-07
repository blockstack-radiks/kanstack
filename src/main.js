// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import VueDialog from 'vuejs-dialog'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(FontAwesomeIcon)
Vue.use(VueDialog)

import './assets/sass/_variables.scss'
import './assets/sass/app.scss'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import db from './db'

window.db = db

import App from './App'
import NewBoard from './components/boards/New.vue'
import BoardsIndex from './components/boards/Index.vue'
import ShowBoard from './components/boards/Show.vue'

window.blockstack = require('blockstack')

Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    { path: '/boards/new', component: NewBoard, name: 'boards_new' },
    { path: '/', component: BoardsIndex, name: 'boards_index' },
    { path: '/boards/:id', component: ShowBoard, name: 'boards_show' }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router: router,
  components: { App }
})

