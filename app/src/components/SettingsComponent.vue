<template>
<div>
<NavbarSection/>

<div class="container">
<form @submit.prevent="updateProfile" method="post" enctype="multipart/form-data">
<div v-if="!Sprofilepic">
    <input type="file" name="files" v-on:change="onProfilepicChange">
</div>
<div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeProfilepic">Remove image</button>
</div>

<div v-if="!Sbanner">
    <input type="file" name="files" v-on:change="onBannerChange">
</div>
<div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeBanner">Remove image</button>
</div>
<b-button variant="secondary" size="sm" type="submit">Update</b-button>
</form>
</div>

</div>
</template>

<script>
import AccountService from '../AccountService';
import NavbarSection from './NavbarComponent';
import ProfileService from '../ProfileService';
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

</style>