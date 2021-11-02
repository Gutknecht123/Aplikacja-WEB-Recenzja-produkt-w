<template>
<div id="container">
    <h2>Register Page...</h2>
    <br>
    <br>
    <br>
    <b-form id="register-form" @submit.prevent="Register">
    
    <div class="register-section">

    <b-tabs content-class="mt-3" fill>
    <b-tab title="Register" active>
    <b-form-group id="login-group" label="Your login" label-for="login-input">

    <b-form-input id="login-input" placeholder="Enter loginx"  v-model="login"></b-form-input>
    
    </b-form-group>

    <br>

    <b-form-group id="password-group" label="Your password" label-for="password-input">

    <b-form-input id="password-input" placeholder="Enter password" type="password"  v-model="password"></b-form-input>

    </b-form-group>
    <br>
    <b-form-group id="repassword-group">

    <b-form-input id="repassword-input" placeholder="Re-enter password" type="password" v-model="repassword"></b-form-input>

    </b-form-group>
    <br>
    <b-form-group id="email-group" label="Your E-mail" label-for="email-input">

    <b-form-input id="email-input" placeholder="Enter e-mail" type="email"  v-model="email"></b-form-input>

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
    <b-tab title="Login">
    <div class="Login">

    <LoginSection/>

    </div>
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
import { reactive } from '@vue/composition-api'

export default {
 name: 'RegisterComponent',
 components:{
     LoginSection
 },

 setup () {
     const state = reactive({

         login: '',
         password: '',
         email: '',
         name: '',
         surname: ''     

     })

     const rules = {

     
     login: { required },
     password: { required },
     repassword: { required },
     email: { required, email }
     
 }

 const v$ = useVuelidate(rules, state)

 return { state, v$ }


 },

 data(){
     return { 

         login: '',
         password: '',
         email: '',
         name: '',
         surname: ''

     }
 },

 methods: {


     validationStatus(validation){
         return typeof validation != "undefined" ? validation.$error : false;
     },

     Register(event){

        event.preventDefault();

        if(this.$v.$pendding || this.$v.$error) return;

        AccountService.createAccount(this.login, this.password, this.email, this.name, this.surname);
        alert("Konto utworzone");
         
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