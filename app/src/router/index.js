import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({

    routes:[
        
    {

        path: '/',
        name: 'main',
        component: () => import('@/components/PostComponent')

    },
    {

        path: '/login',
        name: 'login',
        component: () => import('@/components/RegisterComponent')

    },
    {

        path: '/user/:profile',
        name: 'profile',
        component: () => import('@/components/ProfileComponent')

    },
    {

        path: '/search/:phrase',
        name: 'search',
        component: () => import('@/components/SearchComponent')

    },
    {

        path: '/settings',
        name: 'settings',
        component: () => import('@/components/SettingsComponent')

    },
]

})