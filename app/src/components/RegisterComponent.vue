<template>
<div id="container">

    <b-form id="register-form" @submit.prevent="Register">
    
    <div class="register-section">
    <h3 align="center"> Already have an account? <a href="#/login">Log in!</a></h3>
    <b-card bg-variant="dark" text-variant="white" border-variant="info" class="mt-3">
    <b-form-group id="login-group" label="Your login" label-for="login-input">

    <b-form-input id="login-input" placeholder="min. 3 signs"  v-model="login"></b-form-input>
    <div class="text-danger" v-if="v$.login.$error">Login field has an error</div>
    <div class="text-danger" v-if="!v$.login.$error && loginerror.length>0">{{loginerror}}</div>
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

    <b-form-input id="email-input" placeholder="Enter e-mail" v-model="email"></b-form-input>
    <div class="text-danger" v-if="v$.email.$error">E-mail field has an error</div>
    <div class="text-danger" v-if="!v$.email.$error && emailerror.length>0">{{emailerror}}</div>
    </b-form-group>
    <vue-recaptcha ref="recaptcha" sitekey="6Le8EngeAAAAAOM4jPbe8KlBXQH38fFwWOApgyXk" @verify="onVerify"></vue-recaptcha>
    <div class="text-danger" v-if="error.length!=0">{{error}}</div>
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
import { VueRecaptcha } from 'vue-recaptcha';
import { required, email, minLength, maxLength, sameAs, helpers } from '@vuelidate/validators';

const alpha = helpers.regex(/^[a-zA-Z0-9]*$/);

export default {
 name: 'RegisterComponent',
 components:{
      VueRecaptcha
 },
setup: () => ({ v$: useVuelidate() }),
data(){
     return { 

         login: '',
         password: '',
         repassword: '',
         email: '',
         name: '',
         surname: '',
         verify: '',
         error: '',
         isLogin: false,
         loginerror: '',
         emailerror: '',

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
    onVerify: function (response) {
        this.verify = response;
    },

    async Register(){

    try{

        if(!this.checkLogin()){
            return;
        }
        if(!this.checkEmail()){
            return;
        }
        
        const isFormCorrect = await this.v$.$validate();
        let response = await AccountService.Captcha(this.verify);
        this.error = '';

        if(response.data){
        if (!isFormCorrect){ 
            this.$refs.recaptcha.reset();
            return;
        }else{
        AccountService.createAccount(this.login, this.password, this.email, this.name, this.surname);
        this.$router.go();
        }
        }else{
            this.error = "Captcha error!"
            this.$refs.recaptcha.reset();
        }

    }catch(e){
        this.error = "Captcha error!";
        this.$refs.recaptcha.reset();
    }
    },
    async checkLogin(){

        let isLogin = await AccountService.checkLogin(this.login)
                
        if(isLogin.data){
            this.loginerror = "Login already taken!";
            
            return true;
        }else{
            this.loginerror='';
            return false;
        }
        
    },
    async checkEmail(){

        let isEmail = await AccountService.checkEmail(this.email)
                
        if(isEmail.data){
            this.emailerror = "Email already in use!";
            
            return true;
        }else{
            this.emailerror='';
            return false;
        }
        
    }
 },

}
</script>






<style scoped>

h3{
    color: white;
}



#container{

    
    margin-left: auto;
    margin-right: auto;
}

.register-section{

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    height: 100vh;
    width: 80%;
    margin: auto;
    background-color: #1e2935;
}

</style>