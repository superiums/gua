import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css'
import Properties from './router/properties'

Vue.config.productionTip = false
Vue.prototype.prop = Properties

new Vue({
    // router,
    vuetify,
    render: h => h(App)
}).$mount('#app')