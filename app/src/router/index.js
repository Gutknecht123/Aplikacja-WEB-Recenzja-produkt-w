import Vue from 'vue'
import Router from 'vue-router'
import PostComponent from '@/components/PostComponent'
import LoginComponent from '@/components/LoginComponent'
import RegisterComponent from '@/components/RegisterComponent'
import ProfileComponent from '@/components/ProfileComponent'

Vue.use(Router)

export default new Router({

    routes:[
        
    {

        path: '/',
        name: 'main',
        component: PostComponent

    },
    {

        path: '/login',
        name: 'login',
        component: LoginComponent

    },
    {

        path: '/register',
        name: 'register',
        component: RegisterComponent

    },
    {

        path: '/user',
        name: 'profile',
        component: ProfileComponent

    },

]

})