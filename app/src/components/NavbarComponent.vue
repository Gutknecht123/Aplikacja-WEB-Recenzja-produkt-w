<template>
<div>
  <b-navbar fixed="top" toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#/" class="ml-auto">Home</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="mx-auto">
    
      </b-navbar-nav>
      <b-navbar-nav class="mx-auto">

      </b-navbar-nav>
      <b-navbar-nav class="mx-auto">
       
      </b-navbar-nav>
      <b-navbar-nav class="mx-auto">
         
             <b-form-input size="md" v-model="sphrase"  placeholder="Search"></b-form-input>
            
             <b-button size="sm" v-on:click.stop="Search()">Search</b-button>

          <b-nav-item :href="'#/user/'+getUser" v-if="isLoggedIn">{{getUser}}</b-nav-item>
          <b-nav-item  v-if="isLoggedIn" href='#/settings'>Settings</b-nav-item>
          <b-nav-item  v-if="isLoggedIn" @click="logout">Logout</b-nav-item>
          <b-nav-item  v-if="!isLoggedIn" href="#/login">Login</b-nav-item>
          <b-nav-item  v-if="!isLoggedIn" href="#/register">Register</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import AccountService from '../AccountService';
import { mapGetters } from "vuex";
export default { 
     name: 'NavbarSection',

     components:{
       
     },

    data() {
        return {

            sphrase: '',
            auth: false
            
        }
    },
    async created() {

      try{

      const response = await AccountService.getuserAccount(this.$store.state.user, this.$store.state.token);

      if(response){
      this.$store.dispatch('setUser', response.data.login);
      }else{
        this.$store.dispatch('setUser', null);
        this.$store.dispatch('setToken', null);
      }
      }catch(e){
        this.$store.dispatch('setAuth', false);
        
      }


    },

    computed: {
    
        getAuth(){

        const auth = this.$store.state.authenticated;
        console.log(auth);
        return auth;

        },
        ...mapGetters(["isLoggedIn"]),
        ...mapGetters(["getUser"])
    },
    watch: {


    },
    methods: {
        
        async logout(){

            await AccountService.logoutAccount();
            this.$store.dispatch('setUser', null);
            this.$store.dispatch('setToken', null);
            sessionStorage.clear();
            this.$router.push('/login');
        },
        async Search(){

          this.$store.dispatch('setSphrase', this.sphrase);
          //this.$router.push('/search/'+this.sphrase);
          this.$router.push({ name: 'search', params: { phrase: this.sphrase }})

        }


    },

}
</script>
<style scoped>

.navbar.navbar-dark.bg-dark{

  width: 100vw;
  background-color: #1e2935!important;
  
}

</style>