<template>
<div id="container">

    <b-form id="register-form" @submit.prevent="Register">
    
    <div class="register-section">
    
    <b-card bg-variant="dark" text-variant="white" border-variant="info">
    <b-form-group id="login-group" label="Your login" label-for="login-input">

    <b-form-input id="login-input" placeholder="min. 3 signs"  v-model="login" ></b-form-input>
    <div class="text-danger" v-if="v$.login.$error">Login field has an error</div>
    
    </b-form-group>

    <br>

    <b-form-group id="password-group" label="Your password" label-for="password-input">

    <b-form-input id="password-input" placeholder="min. 8 signs" type="password"  v-model="password"></b-form-input>
    <div class="text-danger" v-if="v$.password.$error">Password field has an error</div>

    </b-form-group>
    <br>
    <b-form-group id="repassword-group">

    <b-form-input id="repassword-input" placeholder="Re-enter password" type="password" v-model="repassword"></b-form-input>
    <div class="text-danger" v-if="v$.repassword.$error">Passwords are not the same</div>
    </b-form-group>
    <br>
    <b-form-group id="email-group" label="Your E-mail" label-for="email-input">

    <b-form-input id="email-input" placeholder="Enter e-mail" type="email"  v-model="email"></b-form-input>
    <div class="text-danger" v-if="v$.email.$error">E-mail field has an error</div>

    </b-form-group>
    <br>
    <b-button type="submit" variant="primary">Register</b-button>
    </b-card>
    
  
    </div>
    </b-form>

</div>
</template>

<script>

import AccountService from '../AccountService';
import useVuelidate from '@vuelidate/core';
import { required, email, minLength, maxLength, sameAs, helpers } from '@vuelidate/validators';

const alpha = helpers.regex(/^[a-zA-Z0-9]*$/);

export default {
 name: 'RegisterComponent',
 components:{
      
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
        login: { required, minLength: minLength(3), maxLength: maxLength(12), alpha },
        password: { required, minLength: minLength(8), maxLength: maxLength(27) },
        repassword: {required, sameAs:sameAs(this.password)},
        email: { required, email, maxLength: maxLength(42) }
     }
 },

 methods: {

    async Register(){

        const isFormCorrect = await this.v$.$validate()
        if (!isFormCorrect){ 
            return;
        }else{
        AccountService.createAccount(this.login, this.password, this.email, this.name, this.surname);
        this.$router.go();
        }
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
    height: 100vh;
    width: 80%;
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