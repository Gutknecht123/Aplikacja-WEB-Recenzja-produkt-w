import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state:{
        authenticated: false,
        user: null,
        sphrase: null,
        postcount: 5,
        posts: [],
        global: 0,
        token: null
    },
    mutations:{
        SET_AUTH (state, auth){
            state.authenticated = auth;
        },
        SET_USER (state, user){
            state.user = user;
        },
        SET_SPHRASE (state, sphrase){
            state.sphrase = sphrase;
        },
        SET_POSTCOUNT (state, postcount){
            state.postcount += postcount;
        },
        SET_POSTS (state, posts){
            state.posts = posts;
        },
        SET_GLOBAL (state, global){
            state.global = global;
        },
        SET_TOKEN (state, token){
            state.token = token;
        }
    },
    actions:{
        setAuth (context, auth) {
            context.commit('SET_AUTH', auth);
        },
        setSphrase (context, sphrase) {
            context.commit('SET_SPHRASE', sphrase);
        },
        setPostCount (context, postcount) {
            context.commit('SET_POSTCOUNT', postcount);
        },
        setPosts (context, posts) {
            context.commit('SET_POSTS', posts);
        },
        setGlobal (context, global) {
            context.commit('SET_GLOBAL', global);
        },
        setUser (context, user) {
            context.commit('SET_USER', user);
        },
        setToken (context, token) {
            context.commit('SET_TOKEN', token);
        },
    },
    getters: {
        isLoggedIn(state) {
            console.log(!!state.token);
          return !!state.token;
        },
        getUser(state){
            return state.user;
        }
      },
    modules:{}

})