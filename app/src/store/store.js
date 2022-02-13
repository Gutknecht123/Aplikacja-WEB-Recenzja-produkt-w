import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({

    state:{
        authenticated: false,
        profile: null,
        sphrase: null,
        postcount: 5,
        posts: [],
        global: 0
    },
    mutations:{
        SET_AUTH (state, auth){
            state.authenticated = auth;
        },
        SET_PROFILE (state, profile){
            state.profile = profile;
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
        }
    },
    actions:{
        setAuth (context, auth) {
            context.commit('SET_AUTH', auth);
        },
        setProfile (context, profile) {
            context.commit('SET_PROFILE', profile);
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
        }
    },
    modules:{}

})