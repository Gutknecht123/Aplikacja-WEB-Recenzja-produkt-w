<template>
<div  class="container">

<div class="settings shadow-lg mt-3 rounded">

<form @submit.prevent="updateProfile" method="post" enctype="multipart/form-data">
<div class="user-photos">

<b-row class="mt-5">
<b-col>
<div class="text">Choose your banner picture:</div>
<b-img :src="Cbanner" class="banner-pic border-bottom border-dark" fluid alt="Failed to load" align="center" v-if="Sbanner==''"></b-img>
<b-img :src="Sbanner" class="banner-pic border-bottom border-dark" fluid alt="Failed to load" align="center" v-else></b-img>
<div v-if="!Sbanner">
    <label class="custom-file-upload">
    <input type="file" name="files" v-on:change="onBannerChange">Upload banner image
    </label>
</div>

<div v-else>
    <button v-on:click="removeBanner">Remove image</button>
</div>
<div class="text-danger" v-if="v$.banner.$error">Unsuporrted file! Jpeg, jpg, png file only!</div>
</b-col>
</b-row>
<b-row class="mt-5">
</b-row>    
<b-row class="mt-5">
<b-col>
<div class="text">Choose your profile picture:</div>
<b-avatar size="130px" square v-if="Sprofilepic==''"><b-img :src="Cprofilepic" alt="" class="profile-pic border-bottom border-dark" align="center"></b-img></b-avatar>
<b-avatar size="130px" square v-else><b-img :src="Sprofilepic" alt="" class="profile-pic border-bottom border-dark" align="center"></b-img></b-avatar>
<div v-if="!Sprofilepic">
    <label class="custom-file-upload">
    <input type="file" name="files" v-on:change="onProfilepicChange">Upload profile pic
    </label>
</div>
<div v-else>
    <button v-on:click="removeProfilepic">Remove image</button>
</div>
<div class="text-danger" v-if="v$.profilepic.$error">Unsuporrted file! Jpeg, jpg, png file only!</div>
</b-col>
</b-row>

<b-row>
<b-col>
    <div class="text">Change your description:</div>
    <b-form-textarea
      class="textarea"
      v-model="description"
      :placeholder="description"
      rows="4"
      max-rows="8"
      no-resize
      
></b-form-textarea>
<div class="text-danger" v-if="v$.description.$error">Max length - 101 chars</div>
</b-col>
</b-row>

<b-button variant="secondary" size="sm" type="submit">Update</b-button>

</div>


</form>

</div>


</div>
</template>

<script>
//import AccountService from '../AccountService';
import SettingsService from '../SettingsService';
import useVuelidate from '@vuelidate/core';
import { maxLength } from '@vuelidate/validators'

const CheckSize = (value) =>  {
  if (!value) {
    return true;
  }
  let file = value;
  
    if(file.size < 10485760){
      return (file.size < 10485760)
    }
  
  console.log("Zbyt duży plik!");
  return false;
};
const CheckType = (value) => {
  if (!value) {
    return true;
    }
    let file = value;
    
      if(file.type.startsWith('image')){
        return true;
      }
    
    console.log("Nieprawidłowy plik!");
    return false;
}

export default {
    name: 'SettingsComponent',
    components:{
        
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
        return{
            
            data: '',
            user: '',
            files: null,
            profilepic: '',
            banner: '',
            Cprofilepic: '',
            Cbanner: '',
            Sprofilepic: '',
            Sbanner: '',
            description: '',
            sending: ''

        }
    },
    validations(){

     return{
        profilepic: { CheckSize, CheckType },
        banner: { CheckSize, CheckType },
        description: { maxLength: maxLength(101) }
     }

    },
    async created(){
        
        this.user = this.$store.state.user;

        const userProfile = await SettingsService.getProfile(this.user);

        this.Cbanner = userProfile.data[0].banner;

        this.Cprofilepic = userProfile.data[0].profilePic;

        this.description = userProfile.data[0].description;

    },
    methods: {

    async updateProfile(){

        const isFormCorrect = await this.v$.$validate()
        if (!isFormCorrect){ 
          return;
        }else{

        const formData = new FormData();

        if(this.profilepic!='' && this.banner!=''){
            this.sending = 'both'
        }else if(this.profilepic!='' && this.banner==''){
            this.sending = 'profilepic'
        }else if(this.profilepic=='' && this.banner!=''){
            this.sending = 'banner'
        }

        formData.append('username', this.user);
        formData.append('description', this.description);
        formData.append('sending', this.sending);
        formData.append('files', this.profilepic);
        formData.append('files', this.banner);

        await SettingsService.updateProfile(formData);

        this.data = await SettingsService.getProfile(this.user);
        }
    },

    async onProfilepicChange(e) {
         
        var files = e.target.files || e.dataTransfer.files;

        this.profilepic = files[0];

        this.$v.profilepic.$touch();

        if (this.$v.profilepic.$error) {
        console.log("Zły plik")
        this.profilepic = '';
        return;	
        }

        if (!files.length)
            return;
        this.createProfilepic(files[0]);
    },
    async onBannerChange(e) {
        
        var files = e.target.files || e.dataTransfer.files;

        this.banner = files[0];

        this.$v.banner.$touch();

        if (this.$v.banner.$error) {
        console.log("Zły plik")
        this.banner = '';
        return;	
        }

        if (!files.length)
            return;
        this.createBanner(files[0]);
    },

    async createBanner(file) {
      //var media = new Image();
      var reader = new FileReader();
      //var vm = this;

      reader.onload = (e) => {
        this.Sbanner = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async createProfilepic(file) {
      //var media = new Image();
      var reader = new FileReader();
      //var vm = this;

      reader.onload = (e) => {
        this.Sprofilepic = e.target.result;
      };
      reader.readAsDataURL(file);
    },



    removeProfilepic:async function () {
      this.Sprofilepic = '';
      this.profilePic = '';
    },
    removeBanner:async function () {
      this.Sbanner = '';
      this.banner = '';
    },
    }
}
</script>

<style scoped>

.container {

    margin-top: 2%;
    background-color:#222930;
    height: 100vh;

}

.settings {

    background-color: #1e2935;

}

.photos {

    padding-top: 10%;

}

.text{

    color: white;

}

.user-photos{
    padding-top: 10%;
}

.textarea{
    color: #e3e7eb;
    background-color: #1e2935;
    border-radius: 10px;
    width: 75%;
    margin-left: auto;
    margin-right: auto;
}
.profile-pic{

  height: 100%;
  width: 100%;
  object-fit: cover;
    

}
.banner-pic{

  height: 100%;
  width: 100%;
  max-height: 329px;
  margin: auto;
    

}
input[type="file"] {
    display: none;
}

.custom-file-upload {
    border: 1px solid #ccc;
    color: white;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}
@media screen and (max-width: 1000px) {
    .container{
        height: 100%;
    }
}
</style>