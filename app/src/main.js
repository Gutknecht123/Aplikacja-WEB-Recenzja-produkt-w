import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
import VueCompositionAPI from '@vue/composition-api'
import store from './store/store'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
Vue.config.productionTip = false



new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

Vue.use(VueVideoPlayer,)

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

Vue.use(VueCompositionAPI)

Vue.use(Vuelidate)