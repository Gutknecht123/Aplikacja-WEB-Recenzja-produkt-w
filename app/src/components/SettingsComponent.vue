<template>
<div>
<NavbarSection/>
<div class="container mt-5">
<div class="settings shadow-lg mt-3 rounded">

<form @submit.prevent="updateProfile" method="post" enctype="multipart/form-data">

<b-container class="photos">
<b-row class="mb-5">

<b-col>
<div v-if="!Sprofilepic">
    <input type="file" name="files" v-on:change="onProfilepicChange">
</div>

<div v-else>
    <p><img :src="Sprofilepic" class="post-img" /></p>
    <button v-on:click="removeProfilepic">Remove image</button>
</div>
</b-col>

</b-row>
<b-row class="mb-5">

<b-col>
<div v-if="!Sbanner">
    <input type="file" name="files" v-on:change="onBannerChange">
</div>

<div v-else>
    <p><img :src="Sbanner" class="post-img" /></p>
    <button v-on:click="removeBanner">Remove image</button>
</div>

</b-col>
</b-row>

<b-button class="mb-5" variant="secondary" size="sm" type="submit">Update</b-button>


</b-container>
</form>

</div>
</div>

</div>
</template>

<script>
import AccountService from '../AccountService';
import NavbarSection from './NavbarComponent';
import SettingsService from '../SettingsService';

export default {
    name: 'SettingsComponent',
    components:{
        NavbarSection
    },

    data(){
        return{
            
            data: '',
            user: '',
            files: null,
            profilepic: '',
            banner: '',
            Sprofilepic: '',
            Sbanner: ''

        }
    },
    async created(){

        const response = await AccountService.getuserAccount();
        
        this.user = response.data.login;

        this.data = await SettingsService.getProfile(this.user);



    },
    methods: {

    async updateProfile(){

        const formData = new FormData();

        formData.append('username', this.user);  
        formData.append('files', this.profilepic);
        formData.append('files', this.banner);

        await SettingsService.updateProfile(formData);

        this.data = await SettingsService.getProfile(this.user);

    },

    async onProfilepicChange(e) {
        this.profilepic = e.target.files[0];
        
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.createProfilepic(files[0]);
    },
    async onBannerChange(e) {
        this.banner = e.target.files[0];
        
        var files = e.target.files || e.dataTransfer.files;
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
    },
    removeBanner:async function () {
      this.Sbanner = '';
    },
    }
}
</script>

<style scoped>

.container {

    margin-top: 2%;
    height: 100em;
    

}

.settings {

    background-color: #1e2935;

}

.photos {

    
    padding-top: 10%;

}

</style>