import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({

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
    {

        path: '/main',
        name: 'mainpage',
        component: () => import('../views/Posts')

    },
]

})

import $eventHub from '../components/eventHub'

router.beforeEach((to, from, next) => {
    if (typeof to.matched[0]?.components.default === 'function') {
        $eventHub.$emit('asyncComponentLoading', to) // Start progress bar
    }
    next()
})

router.beforeResolve((to, from, next) => {
    $eventHub.$emit('asyncComponentLoaded') // Stop progress bar
    next()
})

export default router;