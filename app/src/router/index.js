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
        component: () => import('../views/Register')

    },
    {

        path: '/login',
        name: 'login',
        component: () => import('../views/Login')

    },
    {

        path: '/user/:profile',
        name: 'profile',
        component: () => import('../views/Profile')

    },
    {

        path: '/search/:phrase',
        name: 'search',
        component: () => import('../views/Search')

    },
    {

        path: '/settings',
        name: 'settings',
        component: () => import('../views/Settings')

    },
]

})


export default router;