import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({

    state:{
        authenticated: false
    },
    mutations:{
        SET_AUTH (state, auth){
            state.authenticated = auth;
        }
    },
    actions:{
        setAuth (context, auth) {
            context.commit('SET_AUTH', auth);
        }
    },
    modules:{}

})