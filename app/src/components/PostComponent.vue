<template>

<div>
<div id="container">

<div class="postcreation" v-if="isLoggedIn" data-cy='post-create'>
<form @submit.prevent="createPost" method="post" enctype="multipart/form-data" data-cy='post-create-form'>
<b-card class="createpost shadow-lg p-3 mt-5 rounded" text-variant="white" border-variant="dark">
<b-row class="mt-3">
<b-col>
<b-form-input data-cy='post-create-title' v-model="title" placeholder="Enter title" class="title"></b-form-input>
<div class="text-danger" v-if="v$.title.$error">Wrong title! 2-101 chars!</div>
</b-col>
</b-row>
<b-row class="mt-3">
<b-col>

<div v-if="!media">
  <label class="custom-file-upload">
    <input type="file" name="files" multiple v-on:change="onFileChange"> Upload image/mp4
  </label>
  </div>
  <div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeImage">Remove image</button>
  </div>
 <div class="text-danger" v-if="v$.files.$error">Unsuported file</div>
</b-col>
</b-row>

<b-row class="mt-3">
<b-col>
<b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="4"
      max-rows="8"
      no-resize
      data-cy='post-create-text'
></b-form-textarea>
<div class="text-danger" v-if="v$.text.$error">Wrong text! 2-512 chars!</div>
</b-col>
</b-row>
<b-row class="mt-3">
<b-col>
<b-form-input v-model="category" placeholder="Enter category" id = "category" data-cy='post-create-category'></b-form-input>
<div class="text-danger" v-if="v$.category.$error">Wrong category! 2-16 chars!</div>
</b-col>
</b-row>
<b-row class="mt-3">
<b-col id="stars">
<star-rating v-bind:increment="0.5"
             v-bind:max-rating="5"
             inactive-color="#0099cc"
             active-color="#ffcc66"
             v-bind:rating="stars"
             v-bind:show-rating="false"
             v-bind:star-size="40" v-model="stars"  @rating-selected="setRating" data-cy='post-create-stars'></star-rating>

</b-col>

</b-row>

<b-row class="mt-5">
<b-col>
<b-button variant="secondary" size="md" type="submit" data-cy='post-create-publish'>Publish</b-button>
</b-col>
</b-row>

</b-card>

</form>
</div>

<p class="error" v-if="error">{{error}}</p>

<div class="posts shadow=lg mt-5 rounded">

<b-container class="nav-buttons" v-if="isLoggedIn" data-cy='post-navigation'> 
<b-row class="mt-3">
<b-col align="right">
<b-button variant="secondary" class="global" size="lg" data-cy='post-global' v-on:click="globalPosts()">Global</b-button>
</b-col>
<b-col align="left">
<b-button variant="secondary" class="follows" size="lg" data-cy='post-follow' v-on:click="followsPosts()">Follows</b-button>
</b-col>
</b-row>
</b-container>

<Posts/>

</div>
</div>

<div class="pagefooter shadow-lg p-3 mt-5 rounded" v-if="isLoggedIn" data-cy='post-create2'>
<b-navbar toggleable="md" type="dark" variant="dark" fixed="bottom" v-if="tothetop==true">
<b-button class="addButton" variant="secondary" size="lg" v-on:click="create=!create" v-if="!create">+</b-button>
<div class="postcreation" v-if="create">
<form @submit.prevent="createPost" method="post" enctype="multipart/form-data">
<b-card class="createpost shadow-lg p-3 mt-5 rounded" text-variant="white" border-variant="dark">
<b-row class="mt-3">
<b-col>
<b-form-input v-model="title" placeholder="Enter title" class="title"></b-form-input>
<div class="text-danger" v-if="v$.title.$error">Wrong title! 2-101 chars!</div>
</b-col>
</b-row>
<b-row class="mt-3">
<b-col>

<div v-if="!media">
  <label class="custom-file-upload">
    <input type="file" name="files" multiple v-on:change="onFileChange">Upload image/mp4
  </label>  
  </div>
  <div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeImage">Remove image</button>
  </div>
 <div class="text-danger" v-if="v$.files.$error">Unsuported file</div>
</b-col>
</b-row>

<b-row class="mt-3">
<b-col>
<b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="4"
      max-rows="8"
      no-resize
></b-form-textarea>
<div class="text-danger" v-if="v$.text.$error">Wrong text! 2-24 chars!</div>
</b-col>
</b-row>
<b-row class="mt-3">
<b-col>
<b-form-input v-model="category" placeholder="Enter category" id = "category"></b-form-input>
<div class="text-danger" v-if="v$.category.$error">Wrong category! 2-16 chars!</div>
</b-col>
</b-row>
<b-row class="mt-3">
<b-col id="stars">
<star-rating v-bind:increment="0.5"
             v-bind:max-rating="5"
             inactive-color="#0099cc"
             active-color="#ffcc66"
             v-bind:rating="stars"
             v-bind:show-rating="false"
             v-bind:star-size="40" v-model="stars"  @rating-selected="setRating"></star-rating>

</b-col>

</b-row>

<b-row class="mt-5">
<b-col>
<b-button variant="secondary" size="md" type="submit">Publish</b-button>
</b-col>
</b-row>
<b-row>
<b-col>
<b-button class="postcreation mt-2" v-on:click="create=!create" v-if="create">Hide</b-button>
</b-col>
</b-row>
</b-card>

</form>
</div>

</b-navbar>
</div>

</div>

</template>

<script>
import PostService from '../PostService';
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import StarRating from 'vue-star-rating'
import ProfileService from '../ProfileService';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators'
import Posts from './Posts';
import { mapGetters } from "vuex";
const CheckSize = (value) =>  {
  if (!value) {
    return true;
  }
  let file = value;

  console.log(file[0].size)

  for(var i=0; i<file.length; i++){
    if(file[i].size < 10485760){
      return (file[i].size < 10485760)
    }
  }
  console.log("Zbyt duży plik!");
  return false;
};

const CheckType = (value) => {
  if (!value) {
    return true;
    }
    
    let file = value;

    for(var i=0; i<file.length; i++){
      if(file[i].type.startsWith('image')||file[i].type.startsWith('video')){
        return true;
      }
    }
    console.log("Nieprawidłowy plik!");
    return false;
}

export default {
  name: 'PostComponent',
   components:{
     StarRating,
     Posts
 },

 setup: () => ({ v$: useVuelidate() }),

  data(){
    return { 
      posts: [],
      comments: [],
      error: '',
      title: '',
      text: '',
      media: '',
      category: '',
      stars: 1,
      user: '',
      isDisabled: false,
      files: null,
      commsbutton: false,
      selected: '',
      create: false,
      commenttext: '',
      playerOptions: [{

            playbackRates: [1.0, 2.0, 3.0], 
            autoplay: false, 
            muted: true, 
            loop: false, 
            preload: "auto", 
            language: "en",
            aspectRatio: "16:9",
            fluid: true,
            sources: [{
            type: "video/mp4",
            src: ""
            }],
            poster: "",
            notSupportedMessage: "This video can't be played temporarily. Please try again later",
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true 
              }
          }],
      medialist:[],
      PostCount: 5,
      follows: [],
      global: 0,
      tothetop: false,
      pictures: [],
      Loading: true,
      auth: ''
      

    }
  },
  validations(){

     return{
        title: { required, minLength: minLength(2), maxLength: maxLength(24) },
        text: { required, minLength: minLength(2), maxLength: maxLength(512) },
        category: { required, minLength: minLength(2), maxLength: maxLength(16) },
        files: { CheckSize, CheckType },
     }
  },

  async created(){

    try{

      this.$store.dispatch('setPostCount', ((-1)*(this.$store.state.postcount-5)));

      this.user = this.$store.state.user;

    }catch(error){
      this.$store.dispatch('setAuth', false);
      
      this.error = error.message;
    }
    },

  mounted() {

      this.scroll();
      
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      },
        ...mapGetters(["isLoggedIn"]),
        ...mapGetters(["getUser"])
    },

  methods: {

      async createPost(){ 

      const isFormCorrect = await this.v$.$validate()
        if (!isFormCorrect){ 
            return;
        }else{

      const formData = new FormData();
      

      formData.append('creator', this.user);
      formData.append('title', this.title);
      formData.append('text', this.text);
      formData.append('category', this.category);
      formData.append('stars', this.stars);

      if(this.files != null){

       for (const i of Object.keys(this.files)) {
            formData.append('files', this.files[i])
          }
      }
      await PostService.createPost(formData);
      if(this.$store.state.global==0){
      this.posts = await PostService.getPosts(this.$store.state.postcount);
      this.$store.dispatch('setPosts', this.posts);
      }
      this.media='';
      this.title='';
      this.category='';
      this.files=null;
      this.text='';
      this.stars=1;
      }
    },

    setRating: function(rating){
      this.stars= rating;
    },

     async onFileChange(e) {
      
      var files = e.target.files || e.dataTransfer.files;

      this.files = files;
    
      this.$v.files.$touch();

      if (this.$v.files.$error) {
        console.log("Zły plik")
        return;	
      }
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    async createImage(file) {
    
      var reader = new FileReader();
    
      reader.onload = (e) => {
        this.media = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage:async function () {
      this.media = '';
    },

    async scroll () {
      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {

        this.$store.dispatch('setPostCount', 5);

        this.Loading = true;
      
          if(this.global==0){
            this.setPosts();
          }else if(this.global==1){
            this.followsPosts();
          }
        }

        if(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)>=500){
              this.tothetop = true;
        }else if (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)<500){
              this.tothetop = false;
             
        }
        console.log(this.$store.state.postcount);
        }

        

       },

      async setPosts(){

        let tempposts = await PostService.getPosts(this.$store.state.postcount-1);

        if(this.$store.state.posts.length != tempposts.length){

        this.$store.dispatch('setPosts', tempposts);

        this.$store.dispatch('setGlobal', this.global);

        }

      },
      async globalPosts(){

        this.global = 0;

        this.$store.dispatch('setPostCount', ((-1)*(this.$store.state.postcount-5)));

        this.setPosts();

      },
      async followsPosts(){

        this.global = 1;

        this.$store.dispatch('setGlobal', this.global);

        this.follows = await ProfileService.getFollows(this.user);
    
        let tempposts = await PostService.getfollowsPosts(this.follows.data.Followings, this.$store.state.postcount);

        this.$store.dispatch('setPosts', tempposts);

      },
      async scrollToTop() {

        window.scrollTo(0,0);

        this.tothetop = false;
        
      },

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.post-header{

  background-color: #1e2935;

}

.post-media{

  height: 90%;
  width: 100%;
  max-height: 900px;
  overflow: hidden;
  object-fit: cover;
  margin-top: 3%;
  margin-bottom: 3%;

}
.post-card{

  background-color: #1e2935;

}

.postcreation{

  width: 95%;
  margin-top: 5%;
  margin: auto;

}

.comments {
  
  background-color: #222930;
  max-height: 1000px;
  overflow: auto;

}
.comment {

  margin-top: 5%;
  background-color: #1e2935;
 
}

.posts {

  display: flex;
  flex-direction: column;

}

.createpost{

  background-color: #1e2935;
  width: 70%;
  color: white;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  
}
.post{
  
  background-color: #1e2935;
  margin: auto;
  width: 100%;
  margin-top: 5%;

}

.global{

  width: 70%;
  
}
.follows{

  width: 70%;
 
}
.content{

  margin: auto;
  
}

#container{

  position: relative;
  background-color:#222930;
  margin: auto;

}
.media-img{

  width: 50%;

}
.creator-img{

  width: 50px;
  border-radius: 25px;

}

.post-img{

  width: 25%;

}

.createpost-flex{

  display: flex;
  flex-direction: column;
  justify-content: center;

}


#textarea {

    color: #e3e7eb;
    background-color: #1e2935;
    border-radius: 10px;
    width: 95%;
    margin-left: auto;
    margin-right: auto;

}
#category{

  width: 95%;
  margin-left: auto;
  margin-right: auto;
  color: #e3e7eb;
  background-color: #1e2935;

}

#stars{

  position: absolute;
  left: 35%;
  
}

.post-text{
  text-align: left;
  margin-top: 5%;
  margin-bottom: 5%;
}

.stars-cat{

  margin-top: 1%;

}
.post-content{

  width: 90%;

}

.custon-arrow{

  height: 200px;

}

.navbar.navbar-dark.bg-dark{

  background:rgba(0,0,0,0)!important;
  width: 60%;
  margin-left: 10%;
  
}

.title{

  color: #e3e7eb;
  background-color: #1e2935;
  width: 95%;
  margin: auto;
}

.nav-button1{

  position: absolute;
  top: 38%;
  left: 0.5%;
  height: 10%;
  width: 5%;
  opacity: 0.4;

}

.nav-button2{

  position: absolute;
  top: 38%;
  right: 0.5%;
  height: 10%;
  width: 5%;
  opacity: 0.4;

}
.nav-button1:hover,.nav-button2:hover{

  opacity: 0.6;

}

.media-container{

  position: relative;
  height: 100%;

}

.submitB{
  margin-top: 10%;
}

.addButton{
  width: 150px;
}

input[type="file"] {
    display: none;
}

.custom-file-upload {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}

@media screen and (max-width: 1200px) {

    .createpost{

      width: 80%;

    }
    .navbar.navbar-dark.bg-dark{

      margin-left: 0%;
  
    }
    .addButton{
      width: 20%;
    }
    .global{

      width: 100%;
  
    }
    .follows{

      width: 100%;
 
    }
}

@media screen and (max-width: 1000px) {

    .createpost{

      width: 100%;

    }
    #stars{

      position: absolute;
      left: 15%;
    
    }
    #category{

      width: 95%;

    }
    .submitB{

      margin-top: 20%;

    }
    .navbar.navbar-dark.bg-dark{

      background:rgba(0,0,0,0)!important;
      width: 100%;
  
    }
    .navbar.navbar-dark.bg-dark{

      margin-left: 0%;
  
    }
    .addButton{
      width: 15%;
    }
    .global{

      width: 100%;
  
    }
    .follows{

      width: 100%;
 
    }
}
</style>
<style>        

</style>