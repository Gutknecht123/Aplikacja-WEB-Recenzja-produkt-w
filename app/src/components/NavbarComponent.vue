<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#/mainpage">Home</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <b-navbar-nav>
           <b-nav-item :href="'#/user/'+lUser">{{lUser}}</b-nav-item>
          <b-nav-item href="#/settings">Settings</b-nav-item>
          <b-nav-item v-if="getAuth" @click="logout">Logout</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
            <b-nav-form>
             <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
             <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  </div>
</template>

<script>
import AccountService from '../AccountService';

export default { 
     name: 'NavbarSection',

    data() {
        return {

            auth: '',
            lUser: ''
            
        }
    },
    async created() {

      const response = await AccountService.getuserAccount();

      this.lUser = response.data.login;
      
        
    },

    computed: {
    
        getAuth(){

        const auth = this.$store.state.authenticated;
        console.log(auth);
        return auth;

        }

    },
    methods: {
        
        async logout(){

            await AccountService.logoutAccount();
            this.$router.push('/');
        }

    },

}
</script>
<style scoped>

.navbar.navbar-dark.bg-dark{

  background-color: #1e2935!important;
  
}

</style>