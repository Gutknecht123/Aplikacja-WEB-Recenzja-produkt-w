import Vue from 'vue'
import Router from 'vue-router'
import PostComponent from '@/components/PostComponent'
import SearchComponent from '@/components/SearchComponent'
import RegisterComponent from '@/components/RegisterComponent'
import ProfileComponent from '@/components/ProfileComponent'
import SettingsComponent from '@/components/SettingsComponent'

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
        component: RegisterComponent

    },
    {

        path: '/user/:profile',
        name: 'profile',
        component: ProfileComponent

    },
    {

        path: '/search/:phrase',
        name: 'search',
        component: SearchComponent

    },
    {

        path: '/settings',
        name: 'settings',
        component: SettingsComponent

    },
]

})