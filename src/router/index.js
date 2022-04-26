import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

import Properties from './properties'
import Home from '../views/Home.vue'
import Items from '../views/Items.vue'
import Search from '../views/Search.vue'

// import search from '../views/search.vue'
Vue.use(VueRouter)

Vue.prototype.prop = Properties

const routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    { path: '/Items', name: 'Items', component: Items },
    { path: '/Search', name: 'Search', component: Search },

]

const router = new VueRouter({
    // mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router