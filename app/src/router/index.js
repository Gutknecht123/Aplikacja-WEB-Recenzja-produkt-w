import Vue from 'vue'
import Router from 'vue-router'
//import AccountService from '../AccountService';
import store from '../store/store';
Vue.use(Router)

const router = new Router({

    routes:[
        
    {
        path: '/',
        name: 'main',
        component: () => import('../views/Posts'),
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register'),
        meta: { requiresAuth: false }
    },
    {

        path: '/login',
        name: 'login',
        component: () => import('../views/Login'),
        meta: { requiresAuth: false }
    },
    {

        path: '/user/:profile',
        name: 'profile',
        component: () => import('../views/Profile'),
        meta: { requiresAuth: false }
    },
    {

        path: '/search/:phrase',
        name: 'search',
        component: () => import('../views/Search'),
        meta: { requiresAuth: false }
    },
    {

        path: '/settings',
        name: 'settings',
        component: () => import('../views/Settings'),
        meta: { requiresAuth: true }
    },
    {

        path: '/administration',
        name: 'administration',
        component: () => import('../views/Admin'),
        meta: { requiresAuth: true }
    },
]

})

router.beforeEach((to,from, next) => {
 
    if (to.name==="settings" && to.meta.requiresAuth) {
        console.log(store.state.token);
    
    if(store.state.token==null){
        next({
            path: '/',
            query: { redirect: to.fullPath }
        })
    }else{
        next()
    }

    }else{
        next()
    }

  })

export default router;