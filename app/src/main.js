import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
import VueCompositionAPI from '@vue/composition-api'
Vue.config.productionTip = false



new Vue({
  render: h => h(App),
  router
}).$mount('#app')

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

Vue.use(VueCompositionAPI)

Vue.use(Vuelidate)