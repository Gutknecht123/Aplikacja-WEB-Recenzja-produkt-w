<template>
<div>

    
    <div class="login-section">
    <h3 align="center"> Don't have an account? <a href="#/register">Register here!</a></h3>
    <b-card bg-variant="dark" text-variant="white" border-variant="info" class="mt-3">
    <b-form id="login-form"  @submit.prevent="Login">
    <b-form-group id="login-group2" label="Login" label-for="login-input2">
    <b-form-input id="login-input2" placeholder="Enter login" name="username" v-model="llogin" ></b-form-input>
    </b-form-group>
    <div class="text-danger" v-if="v$.llogin.$error">Incorrect login!</div>
    <br>
    <b-form-group id="password-group2" label="Password" label-for="password-input2">
    <b-form-input id="password-input2" name="password" placeholder="Enter password" type="password"  v-model="lpassword"></b-form-input>
    </b-form-group>
    <div class="text-danger" v-if="v$.lpassword.$error">Incorrect password!</div>
    <vue-recaptcha ref="recaptcha" sitekey="6Le8EngeAAAAAOM4jPbe8KlBXQH38fFwWOApgyXk" @verify="onVerify"></vue-recaptcha>
    <div class="text-danger" v-if="error.length!=0">{{error}}</div>
    <br>
    <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
    </b-card>

    </div>
    
    
</div>
</template>
<script>
import { VueRecaptcha } from 'vue-recaptcha';
import AccountService from '../AccountService';
import useVuelidate from '@vuelidate/core'
import { required, minLength, helpers, maxLength } from '@vuelidate/validators'
const alpha = helpers.regex(/^[a-zA-Z0-9]*$/);
export default { 
     name: 'LoginSection',
     components:{
         VueRecaptcha
     },
     setup: () => ({ v$: useVuelidate() }),
     data(){
     return { 
         
         llogin: '',
         lpassword: '',
         verify: '',
         error: ''
     }
 },

 validations(){
     return{
        llogin: { required, minLength: minLength(3), alpha, maxLength: maxLength(12) },
        lpassword: { required, minLength: minLength(3), maxLength: maxLength(27) },
     }
 },
    methods: {

        onVerify: function (response) {
            this.verify = response;
        },

        async Login(){
            
            try{
                const isFormCorrect = await this.v$.$validate();

                let response = await AccountService.Captcha(this.verify);
                this.error = '';
                if(response.data){

                if (!isFormCorrect){
                 this.$refs.recaptcha.reset();
                 return;
                }else{
                
                let acc = await AccountService.loginAccount(this.llogin, this.lpassword);

                console.log(acc);

                if(acc){

                     this.$store.dispatch('setUser', acc.data.login);

                     this.$store.dispatch('setToken', acc.data.token);

                     localStorage.setItem('jwt', acc.data.token);

                     localStorage.setItem('user', acc.data.login);

                     this.$router.push('/');
                }else{
                    this.error="Invalid login/password or account not activated!"
                }

                }
                }else{
                    this.error = "Captcha error!"
                    this.$refs.recaptcha.reset();
                }
                }catch(e){
                    this.error = "Captcha error!";
                    this.$refs.recaptcha.reset();
                }
        }
        
    }
}
</script>

<style scoped>

h3{

    color: white;

}
.login-section{

    display: flex;
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    height: 100vh;
    width: 80%;
    background-color: #1e2935;

}
.login-section > button{

    width: 20%;

}

</style>