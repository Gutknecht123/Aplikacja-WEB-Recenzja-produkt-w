import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({

    routes:[
        
    {

        path: '/',
        name: 'main',
        component: () => import('../views/Posts')

    },
    {

        path: '/register',
        name: 'register',
        component: () => import('@/components/RegisterComponent')

    },
    {

        path: '/login',
        name: 'login',
        component: () => import('@/components/LoginComponent')

    },
    {

        path: '/user/:profile',
        name: 'profile',
        component: () => import('../views/Profile')

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


export default router;