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
        component: RegisterComponent

    },
    {

        path: '/login',
        name: 'login',
        component: LoginComponent

    },
    {

        path: '/mainpage',
        name: 'mainpage',
        component: PostComponent

    },
    {

        path: '/user/:profile',
        name: 'profile',
        component: ProfileComponent

    },

]

})