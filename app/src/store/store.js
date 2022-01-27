import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({

    state:{
        authenticated: false,
        profile: null,
        sphrase: null,
        postcount: 5
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
        }
    },
    modules:{}

})