import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({

    state:{
        authenticated: false,
        profile: null
    },
    mutations:{
        SET_AUTH (state, auth){
            state.authenticated = auth;
        },
        SET_PROFILE (state, profile){
            state.profile = profile;
        }
    },
    actions:{
        setAuth (context, auth) {
            context.commit('SET_AUTH', auth);
        },
        setProfile (context, profile) {
            context.commit('SET_PROFILE', profile);
        }
    },
    modules:{}

})