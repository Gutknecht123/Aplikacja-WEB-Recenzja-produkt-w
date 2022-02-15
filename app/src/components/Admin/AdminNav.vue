<template>

<div>
  <b-navbar fixed="top" toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#/administration" class="ml-auto">Admin Panel</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="mx-auto">
    
      </b-navbar-nav>
      <b-navbar-nav class="mx-auto">

      </b-navbar-nav>
      <b-navbar-nav class="mx-auto">
       
      </b-navbar-nav>
      <b-navbar-nav class="mx-auto">

             <b-button size="sm" v-on:click.stop="getPosts()">Posts</b-button>

             <b-button size="sm" v-on:click.stop="getAccounts()">Accounts</b-button>

             <b-form-input size="md" v-model="sphrase"  placeholder="Search"></b-form-input>
            
             <b-button size="sm" v-on:click.stop="Search()">Search</b-button>

          <b-nav-item  v-if="isLoggedIn">{{getUser}}</b-nav-item>
          <b-nav-item  v-if="isLoggedIn" @click="logout">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>


</template>

<script>
import PostService from '../../PostService';
import AccountService from '../../AccountService';
import { mapGetters } from "vuex";
export default {

    data() {
        return {
            posts: [],
            accs: [],
            sphrase: ''
        }
    },


    methods: {
        
        async getPosts(){

            this.posts = await PostService.getPosts(10);

            this.$store.dispatch('setPosts', this.posts);

            this.$store.dispatch('setPorA', 0);
        },

        async getAccounts(){

            this.accs = await AccountService.getAccounts(this.$store.state.token);

            this.$store.dispatch('setAccs', this.accs);

            this.$store.dispatch('setPorA', 1);
        },

        async logout(){

            await AccountService.logoutAccount();
            this.$store.dispatch('setUser', null);
            this.$store.dispatch('setToken', null);
            sessionStorage.clear();
            this.$router.push('/');
        },
        async Search(){

          console.log("search");

        }
    },

    computed:{
        ...mapGetters(["isLoggedIn"]),
        ...mapGetters(["getUser"])
    }

}
</script>

<style scoped>



</style>