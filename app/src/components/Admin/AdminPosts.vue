<template>
<div  fluid>

  

<div class="post border border-warning" v-bind:item="post" v-bind:index = "index" v-bind:key="post._id" v-for="(post, index) in posts" fluid>
<b-container class="border border-warning" fluid>
<b-row>
<b-col>
    Creator
</b-col>

<b-col>
    Date/time
</b-col>

<b-col>
    Title
</b-col>
<b-col>
    Stars
</b-col>
<b-col>
    Category
</b-col>

<b-col>
    Text
</b-col>

<b-col>
    Comments
</b-col>
<b-col>
    Likes:
</b-col>
<b-col>
    Options:
</b-col>
</b-row>
</b-container>  
<b-container fluid>
<b-row >
<b-col >
    {{post.creator}}
</b-col>

<b-col>
    {{`${post.createdAt.getFullYear()}-${post.createdAt.getMonth()+1}-${post.createdAt.getDate()}`}}
    {{`${post.createdAt.getHours()}:${post.createdAt.getMinutes()}`}}
</b-col>

<b-col>
    {{post.title}}
</b-col>
<b-col>
   {{post.stars}}
</b-col>
<b-col>
    {{post.category}}
</b-col>

<b-col>
    {{post.text}}
</b-col>

<b-col>
    <b-button align="left" variant="secondary" size="sm" v-if="commsbutton==false || (commsbutton==true && selected != post._id)" v-on:click="showComments(post._id)">Comments</b-button>
</b-col>
<b-col>
    {{post.likedby.length-1}}
</b-col>
<b-col>
    <b-dropdown id="dropdown-dropleft" dropleft text="..." class="m-md-2" size="sm" align="right" v-if="isLoggedIn">
    <b-dropdown-item v-on:click="deletePost(post._id)">Delete</b-dropdown-item>
    </b-dropdown>
</b-col>
</b-row>
<b-row>
<b-col>
Media:
<div v-bind:key = "image" v-bind:index="ix" v-for="(image, ix) in post.files" fluid>
    <a :href="image">
    {{image}}
    </a>
</div>

</b-col>
</b-row>
<b-row>
<b-col>
 <b-card class="comments shadow-lg rounded" text-variant="white" border-variant="dark" v-if="selected == post._id">

<div class="comments1" v-if="selected == post._id">
<div class="comments2" v-bind:item="comment" v-bind:index = "index" v-bind:key="comment._id" v-for="(comment, index) in comments">

<div class="comment border border-dark" v-bind:key = "com" v-for="com in comment.comments">
<b-container class="comm">
<b-row class="mt-3">
<b-col align="left">

<a :href="'#/user/'+com.creator">{{com.creator}}</a>

</b-col>

<b-col align="right">

{{com.createdAt.substring(0,10)}}
<b-dropdown id="dropdown-dropleft" dropleft text="..." class="m-md-2" size="sm" align="right" v-if="isLoggedIn">
    <b-dropdown-item v-on:click="deleteComment(comment._id, com._id, selected)">Delete</b-dropdown-item>
</b-dropdown>
</b-col>

</b-row>

<b-row class="mt-5">
<b-col>
<b-card-text align="left">

{{com.body}}

</b-card-text>
</b-col>
</b-row>
<b-row class="mt-5">
</b-row>
</b-container>
</div>
</div>

</div>

<b-button class="mt-3" variant="secondary" size="sm" v-if="commsbutton==true && selected == post._id" v-on:click="hideComments()">Hide Comments</b-button>

</b-card>
</b-col> 
</b-row>
</b-container>    
</div>

</div>

</template>

<script>
//import Vuetable from 'vuetable-2'
import PostService from '../../PostService';
import CommsService from '../../CommsService';
//import AccountService from '../AccountService';
//import StarRating from 'vue-star-rating'

import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
//import SettingsService from '../SettingsService';
//import ProfileService from '../ProfileService';
import { mapGetters } from "vuex";
export default {

    components:{
        //Vuetable,
        //StarRating,
    },
    data(){
      return {
      posts: [],
      likes: [],
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
      commenttext: '',
      playerOptions: [{

            playbackRates: [1.0, 2.0, 3.0], //Broadcasting speed
            autoplay: false, //If true, the browser will start playing back when it is ready.
            muted: true, // Any audio will be removed by default.
            loop: false, // Causes the video to restart as soon as it's over.
            preload: "auto", // It is recommended that the browser start downloading video data after < video > loading elements. auto browser selects the best behavior and starts loading the video immediately (if supported by the browser)
            language: "en",
            aspectRatio: "16:9", // Place the player in fluid mode and use this value when calculating the dynamic size of the player. The value should represent a scale - two numbers separated by colons (for example, "16:9" or "4:3")
            fluid: true,
            sources: [{
            type: "video/mp4",
            src: ""
            }],
            poster: "",
            notSupportedMessage: "This video can't be played temporarily. Please try again later", //Allows you to override the default information displayed when Video.js is unable to play the media source.
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //Full screen button
              }
          }],
      medialist:[],
      PostCount: 5,
      follows: [],
      global: true,
      tothetop: false,
      pictures: [],
      Loading: true,
      editing: false,
      oneedited: '',
      tabledata: []

}
},

async created() {

    try{

    let tempposts = await PostService.getPosts(0);

    this.$store.dispatch('setPosts', tempposts);
      
    this.user = this.$store.state.user;
      
    this.posts = this.$store.state.posts.then(()=>{
          this.set();
          
      });
      
    }catch(error){
      
      this.error = error.message;
    }
  },
  methods: {
      
    async showComments(id){

        this.commenttext=''

        this.comments = [];

        this.commsbutton = true;

        if(this.selected != id){
        
        this.selected = id;
        }

        if(this.commsbutton == true){
        this.comments = await CommsService.getComments(id);
        }
        if(this.commsbutton == false){
          this.selected = '';
          this.comments = [];
        }
    },

    async hideComments(){

        this.commsbutton = false;

        this.selected = "";

        this.comments = [];

    },

    async deleteComment(id, commid, postid){

    await CommsService.deleteComment(id, commid);
      
    this.showComments(postid);

    },

    async deletePost(id){

    await PostService.deletePost(id);
      
    let tempposts = await PostService.getPosts(0);

    this.$store.dispatch('setPosts', tempposts);
 
    },


    async set(){

        console.log(this.posts)
      },

    },

    computed: {
      newPosts(){
          return this.$store.state.posts;
      },

   
      player() {
        return this.$refs.videoPlayer.player
      },
        ...mapGetters(["isLoggedIn"]),
        ...mapGetters(["getUser"])
    },
    watch: {
      newPosts() {
          
          this.posts = this.$store.state.posts;
        this.pictures = [];
          this.set();
          
      },


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
.post-media{
  height: 50%;
  width: 50%;
  max-height: 700px;
  overflow: hidden;
  object-fit: cover;
}
</style>