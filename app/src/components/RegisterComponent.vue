<template>
<div>
    <h2>Register Page...</h2>
    <div class="register-section">
    <div class="register-text">Your login:</div>
    <div class="register-input"><input type="text" v-model="login"></div>
    <br>
    <div class="register-text">E-mail:</div>
    <div class="register-input"><input type="text" v-model="email"></div>
    <br>
    <div class="register-password-text">Password:</div>
    <div class="register-password-input"><input type="password" v-model="password"></div>
    <br>
    <div class="register-password-text">Re-enter password:</div>
    <div class="register-password-input"><input type="password"></div>
    <br>
    <div class="register-text">Name:</div>
    <div class="register-input"><input type="text" v-model="name"></div>
    <br>
    <div class="register-text">Surname:</div>
    <div class="register-input"><input type="text" v-model="surname"></div>
    <br>
    <b-button variant="outline-dark" v-on:click="createAccount">Register</b-button>
    <br>
    <br>
    <img src="https://cdn.betterttv.net/emote/5b554609c0c5fe4072478d04/3x" alt="">
    </div>
</div>
</template>

<script>

import AccountService from '../AccountService';

export default {
 name: 'RegisterComponent',
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

     async createAccount(){

         await AccountService.createAccount(this.login, this.password, this.email, this.name, this.surname);
         
     }


 }









}
</script>













<style scoped>

h2{

    color: white;

}

.register-section{

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    height: 1000px;
    

}
.register-section > button{

    width: 20%;

}
</style>