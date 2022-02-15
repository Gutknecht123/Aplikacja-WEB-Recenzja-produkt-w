<template>
<div>
<div class="post border border-warning" v-bind:item="acc" v-bind:index = "index" v-bind:key="acc._id" v-for="(acc, index) in accs" fluid>
<b-container class="border border-warning" fluid>
<b-row>
<b-col>
    Login
</b-col>

<b-col>
    LoginUp
</b-col>

<b-col>
    Email
</b-col>
<b-col>
    Active
</b-col>
<b-col>
    CreatedAt
</b-col>
</b-row>
</b-container>  
<b-container fluid>
<b-row >
<b-col >
    {{acc.login}}
</b-col>

<b-col>
    {{acc.loginUp}}
 
</b-col>

<b-col>
    {{acc.email}}
</b-col>
<b-col>
   {{acc.active}}
</b-col>
<b-col>
       {{`${acc.createdAt.getFullYear()}-${acc.createdAt.getMonth()+1}-${acc.createdAt.getDate()}`}}
    {{`${acc.createdAt.getHours()}:${acc.createdAt.getMinutes()}`}}
</b-col>

</b-row>
</b-container>
</div>
</div>
</template>

<script>
import AccountService from '../../AccountService';
export default {

    data() {
        return {
            accs: []
        }
    },


   async created() {
        
        this.accs = await AccountService.getAccounts(this.$store.state.token);
        
    },

    methods: {
        


    },

    computed:{
     newAccs(){
          return this.$store.state.accs;
      },
    },

    watch:{
    newAccs(){
          this.accs = this.$store.state.accs;
      }
    }
}
</script>

<style scoped>

.posts{
    
   margin: auto;
}
.post{
    width: 100%;
    height: 200px;
    max-height: 200px;
    margin-top: 5%;
    overflow: auto;
    font-size: 18px;
    color: white;
    margin-left: auto;
    margin-right: auto;
    
}
.container{
    margin-top: 10%;
    margin-left: auto;
  margin-right: auto;
background-color: #273442;
   width: 100%;
}

</style>