<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-nav>
      <b-nav-item href="#">Home</b-nav-item>

      <!-- Navbar dropdowns -->
      <b-nav-item-dropdown text="Lang" right>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
      </b-nav-item-dropdown>

      <b-nav-item-dropdown text="User" right>
        <b-dropdown-item href="#">Account</b-dropdown-item>
        <b-dropdown-item href="#">Settings</b-dropdown-item>
        <b-dropdown-item v-if="getAuth" @click="logout">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import AccountService from '../AccountService';

export default { 
     name: 'NavbarSection',

    data() {
        return {

            auth: ''
            
        }
    },
    async mounted() {
        
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
