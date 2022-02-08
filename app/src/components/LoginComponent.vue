<template>
<div>

    
    <div class="login-section">

    <b-card bg-variant="dark" text-variant="white" border-variant="info">
    <b-form id="login-form" @submit.prevent="Login">
    <b-form-group id="login-group2" label="Your login" label-for="login-input2">

    <b-form-input id="login-input2" placeholder="Enter login"  v-model="llogin" ></b-form-input>
    
    </b-form-group>
    <br>
    <b-form-group id="password-group2" label="Your password" label-for="password-input2">
    

    <b-form-input id="password-input2" placeholder="Enter password" type="password"  v-model="lpassword"></b-form-input>
    

    </b-form-group>
    <br>
    <b-button type="submit" variant="primary">Login</b-button>
    </b-form>

    </b-card>
    <br>
    <br>
    <img src="https://cdn.betterttv.net/emote/5b554609c0c5fe4072478d04/3x" alt="">
    </div>

    
</div>
</template>

<script>

import AccountService from '../AccountService';


export default { 
     name: 'LoginSection',
     data(){
     return { 
         
         llogin: '',
         lpassword: '',

     }
 },
    methods: {

        async Login(){

            

         
                await AccountService.loginAccount(this.llogin, this.lpassword).then((response) => {

                    if(response.data.message=="Success!"){

                     this.$store.dispatch('setProfile', this.llogin);

                     this.$store.dispatch('setAuth', true);

                     this.$router.push('/');
                    }

                })

            
        }

    }
}
</script>

<style scoped>

h2{

    color: white;

}
.login-section{

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    
    

}
.login-section > button{

    width: 20%;

}

</style>