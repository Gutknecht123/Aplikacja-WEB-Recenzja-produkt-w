<template>
<div id="container">
    <h2>Register Page...</h2>
    <br>
    <br>
    <br>
    <b-form id="register-form" @submit.prevent="Register">
    
    <div class="register-section">

    <b-tabs content-class="mt-3" fill>
    <b-tab title="Login"  active>
    <div class="Login">

    <LoginSection/>

    </div>
    </b-tab>
    <b-tab title="Register">
    <b-form-group id="login-group" label="Your login" label-for="login-input">

    

    
    <b-form-input id="login-input" placeholder="Enter login"  v-model="login" ></b-form-input>
    <div v-if="v$.login.$error">Login field has an error</div>
    
    
    
    </b-form-group>

    <br>

    <b-form-group id="password-group" label="Your password" label-for="password-input">
    

    <b-form-input id="password-input" placeholder="Enter password" type="password"  v-model="password"></b-form-input>
    <div v-if="v$.password.$error">Password field has an error</div>

    </b-form-group>
    <br>
    <b-form-group id="repassword-group">

    <b-form-input id="repassword-input" placeholder="Re-enter password" type="password" v-model="repassword"></b-form-input>
    <div v-if="v$.repassword.$error">Passwords are not the same</div>
    </b-form-group>
    <br>
    <b-form-group id="email-group" label="Your E-mail" label-for="email-input">

    <b-form-input id="email-input" placeholder="Enter e-mail" type="email"  v-model="email"></b-form-input>
    <div v-if="v$.email.$error">E-mail field has an error</div>

    </b-form-group>
    <br>
    <b-form-group id="name-group" label="*Your name" label-for="name-input">

    <b-form-input id="name-input" placeholder="Enter your name"  v-model="name"></b-form-input>
    

    </b-form-group>
    <br>
    <b-form-group id="surname-group" label="*Your surname" label-for="surname-input" description="* - Not required">

    <b-form-input id="surname-input" placeholder="Enter your surname*" v-model="surname"></b-form-input>

    </b-form-group>
    <br>
    <b-button type="submit" variant="primary">Register</b-button>
    <br>
    <br>
    <br>
     <img src="https://cdn.betterttv.net/emote/5b554609c0c5fe4072478d04/3x" alt="">
    </b-tab>

    </b-tabs>
    </div>

    </b-form>

    
   
</div>
</template>

<script>

import AccountService from '../AccountService';
import LoginSection from './LoginComponent';
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'



export default {
 name: 'RegisterComponent',
 components:{
     LoginSection,
     
 },
setup: () => ({ v$: useVuelidate() }),
data(){
     return { 

         login: '',
         password: '',
         repassword: '',
         email: '',
         name: '',
         surname: ''

     }
 },
validations(){
     return{
        login: { required },
        password: { required },
        repassword: {required },
        email: { required, email }
     }
 },

 methods: {

    async Register(){


        
        const isFormCorrect = await this.v$.$validate()
     
        if (!isFormCorrect){ 
           
            return;
        }
        
        AccountService.createAccount(this.login, this.password, this.email, this.name, this.surname);

        this.$router.go();

        
     }


 }


}
</script>






<style scoped>

h2{
    color: white;
}



#container{

    background-color: #2e363f;
    height: 1000px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
}

.register-section{

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;

    
    
}

</style>