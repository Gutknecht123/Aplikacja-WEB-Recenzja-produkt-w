<template>
<div width="100vw">
<div class="post" v-bind:item="post" v-bind:index = "index" v-bind:key="post._id" v-for="(post, index) in posts">
<b-card text-variant="white" border-variant="dark" class="post-card">

<b-card-header header-tag="header" class="post-header">
<b-row>
<b-col>
<b-card-text align="left">
<b-avatar button @click="Gotoprofile(post.creator)" :src="pictures[index]" size="md"></b-avatar> {{post.creator}}
</b-card-text>
</b-col>
<b-col>
<b-card-text align="right">
{{`${post.createdAt.getFullYear()}-${post.createdAt.getMonth()+1}-${post.createdAt.getDate()}`}}
{{`${post.createdAt.getHours()}:${post.createdAt.getMinutes()}`}}
</b-card-text>
<b-dropdown id="dropdown-dropleft" dropleft text="..." class="m-md-2" size="sm" align="right" v-if="isLoggedIn">
    <b-dropdown-item v-if="post.creator==user" v-on:click="editPost(post._id, post.title, post.category, post.stars, post.text)">Edit</b-dropdown-item>
    <b-dropdown-item v-if="post.creator==user" v-on:click="deletePost(post._id)">Delete</b-dropdown-item>
    <b-dropdown-item v-if="post.creator!=user">Report</b-dropdown-item>
</b-dropdown>
</b-col>
</b-row>
</b-card-header>


<b-container v-if="editing==true&&oneedited==post._id">
<form @submit.prevent="Edit(post._id)" method="post" enctype="multipart/form-data">
<b-row>
<b-col>
    <b-form-input v-model="title"  class="Etitle"></b-form-input>
</b-col>        
</b-row>
<b-row class="mt-3">
<b-col>
  <div v-if="!media">
    <input type="file" name="files" multiple v-on:change="onFileChange">
  </div>
  <div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeImage">Remove image</button>
  </div>
</b-col>        
</b-row>
<b-row class="mt-3">
<b-col>
    <b-form-textarea
      id="textarea"
      v-model="text"
      :placeholder="post.text"
      rows="4"
      max-rows="8"
      no-resize
    ></b-form-textarea>
</b-col>        
</b-row>
<b-row class="mt-3">
<b-col>
   <b-form-input v-model="category" class="Ecategory"></b-form-input>
</b-col>        
</b-row>
<b-row class="mt-3">
<b-col id="Estars">
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
<b-button variant="secondary" size="sm" v-on:click="editing=false">Cancel</b-button>
</b-col>
<b-col>
<b-button variant="secondary" size="sm" type="submit">Edit</b-button>
</b-col>
</b-row>
</form>
</b-container>


<div class="title" align="center">{{post.title}}</div>

<div class="media-container">  

<VueSlickCarousel :ref="'carousel'+index" :adaptiveHeight="true" :swipe="true" :arrows ="false" :swipeToSlide="true" v-if="post.files.length > 1">
<div v-bind:key = "image" v-bind:index="ix" v-for="(image, ix) in post.files" fluid>

    <div v-if="image.split('.').pop()=='mp4'" align="center">

    <video-player class="post-media vjs-custom-skin"
                  ref="videoPlayer"
                  :options="playerOptions[index]"
                  :playsinline="true"
                  >
    </video-player>
    </div>

    <div align="center" fluid>
    <b-img :src="image" class="post-media rounded-0" v-if="image.split('.').pop()!='mp4'" contain ></b-img>
    </div>
    
</div>
</VueSlickCarousel>

      <b-button class="nav-button1" v-on:click="prevSlide(0, index)" v-if="post.files.length > 1" align="center" variant="secondary" size="md">&lt;</b-button>
   
      <b-button class="nav-button2" v-on:click="nextSlide(0, index)" v-if="post.files.length > 1" align="center" variant="secondary" size="md">&gt;</b-button>

</div>

  <div  v-if="post.files.length==1">
  <div v-bind:key = "image" v-bind:index="ix" v-for="(image, ix) in post.files" fluid>

    <div v-if="image.split('.').pop()=='mp4'" align="center">

      <video-player class="post-media vjs-custom-skin" 
                  ref="videoPlayer"
                  :options="playerOptions[index]"
                  :playsinline="true"
                  >
      </video-player>

    </div>

    <div align="center" fluid>
      <b-card-img :src="image" class="post-media rounded-0" v-if="image.split('.').pop()!='mp4'" contain ></b-card-img>
    </div>
 
  </div>
  </div>

<b-container class="post-content">
<b-row class="stars-cat">
<b-col>

<star-rating  align="center" v-bind:increment="0.5"
              v-bind:max-rating="5"
              inactive-color="#1e2935"
              active-color="#ffcc66"
              v-bind:rating="post.stars"
              v-bind:read-only="true"
              v-bind:show-rating="false"
              v-bind:star-size="30" class="stars"></star-rating>
</b-col>
<b-col>
<b-card-text align="center">
{{post.category}}
</b-card-text>
</b-col>
</b-row>

<b-card-text>
<div class="post-text">{{post.text}}</div>
</b-card-text>
</b-container>

<footer>

<b-row class="com-likes">
<b-col>
<b-button align="left" variant="secondary" size="sm" v-if="commsbutton==false || (commsbutton==true && selected != post._id)" v-on:click="showComments(post._id)">Comments</b-button>
</b-col> 
<b-col>
<b-card-text>

<b-button variant="secondary" size="sm" :disabled="isDisabled" v-on:click="likePost(post._id, index)" v-if="post.likedby.filter(e => e.username === user).length == 0&& isLoggedIn">{{post.likedby.length-1}} Like</b-button>
<b-button variant="secondary" size="sm" :disabled="isDisabled" v-on:click="unlikePost(post._id, index)" v-if="post.likedby.filter(e => e.username === user).length && isLoggedIn> 0">{{post.likedby.length-1}} Unlike</b-button>

</b-card-text>
</b-col>
</b-row> 

</footer>

</b-card>

<b-card class="comments shadow-lg rounded" text-variant="white" border-variant="dark" v-if="selected == post._id">

<div class="comments1" v-if="selected == post._id">

<b-container class="bv-example-row" v-if="isLoggedIn">
<b-row class="mt-3">
<b-col>
<b-form-textarea
      id="textarea"
      v-model="commenttext"
      placeholder="Enter something..."
      auto-shrink
      no-resize
     
></b-form-textarea>
</b-col>
</b-row >
<b-row class="mt-3">

<b-col>
<b-button  variant="secondary" size="sm" v-on:click="addComment(selected)">Publish</b-button>
</b-col>

</b-row>
</b-container>

<div class="comments2" v-bind:item="comment" v-bind:index = "index" v-bind:key="comment._id" v-for="(comment, index) in comments">

<div class="comment border border-dark" v-bind:key = "com" v-for="com in comment.comments">
<b-container class="comm">
<b-row class="mt-3">
<b-col align="left">

<a :href="'#/user/'+com.creator">{{com.creator}}</a>

</b-col>

<b-col align="right">

{{com.createdAt.substring(0,10)}}
<b-dropdown id="dropdown-dropleft" dropleft text="..." class="m-md-2" size="sm" align="right" v-if="isLoggedIn&&com.creator==user">
    <b-dropdown-item v-if="com.creator==user" v-on:click="deleteComment(comment._id, com._id, selected)">Delete</b-dropdown-item>
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

</div>
</div>
</template>
<script>

import PostService from '../PostService';
import CommsService from '../CommsService';
//import AccountService from '../AccountService';
import StarRating from 'vue-star-rating'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import SettingsService from '../SettingsService';
import ProfileService from '../ProfileService';
import { mapGetters } from "vuex";
export default {
    
    components:{
        VueSlickCarousel,
        StarRating,
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
      
      }
  },
  async created() {
    try{

      
      
      
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

    async addComment(id){

      await CommsService.addComment(id, this.commenttext, this.user);

      this.showComments(id);


    },
    async deleteComment(id, commid, postid){

      await CommsService.deleteComment(id, commid);
      
      this.showComments(postid);

    },
    async Gotoprofile(profile){

      this.$router.push('/user/'+profile);

    },

    async deletePost(id){
      await PostService.deletePost(id);
      this.checkGlobal();
 
    },

    async likePost(postid, index){

      try{

      this.isDisabled = true;

      await PostService.Like(postid, this.user);

      this.isDisabled = false;

      let templikes = await PostService.GetLikes(postid);

      this.posts[index].likedby = templikes.data;

      }catch(e){

        console.log(e);
      }


    },
    async unlikePost(postid, index){

      try{

      this.isDisabled = true;

      await PostService.unLike(postid, this.user);

      this.isDisabled = false;

      let templikes = await PostService.GetLikes(postid);

      this.posts[index].likedby = templikes.data;

      }catch(e){

        console.log(e);
      }


    },

    async checkGlobal(){

    if(this.$store.state.global==0){

            let tempposts = await PostService.getPosts(this.$store.state.postcount)

            this.$store.dispatch('setPosts', tempposts);

      }else if(this.$store.state.global==1){

            this.follows = await ProfileService.getFollows(this.user);
    
            let tempposts = await PostService.getfollowsPosts(this.follows.data.Followings, this.$store.state.postcount)

            this.$store.dispatch('setPosts', tempposts);

      }else if(this.$store.state.global==2){

            let tempposts =  await PostService.getUserPosts(this.$route.params.profile, this.$store.state.postcount)

            this.$store.dispatch('setPosts',tempposts);
      }

    },

    async setPosts(){

        let tempposts = await PostService.getPosts(this.$store.state.postcount-1);

        if(this.posts.length != tempposts.length){
        
        this.posts = tempposts;

        this.pictures = [];

        this.set();

        }  
    },
    async userPic(creator){

        var pic = await SettingsService.getProfile(creator);
        
        this.pictures.push(pic.data[0].profilePic);

      },

    async set(){

        for(var i=0; i<this.posts.length; i++){

        for(var j=0; j<this.posts[i].files.length; j++){

          if(this.posts[i].files[j].split('.').pop()=='mp4'){
          let arrs = {

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
            src: this.posts[i].files[j]
            }],
            poster: "",
            notSupportedMessage: "This video can't be played temporarily. Please try again later", 
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true 
              }
          }

          this.playerOptions[i] = arrs;
         
          }

        }

        await this.userPic(this.posts[i].creator);
      }

      this.Loading = false;

      },

      nextSlide(ix, index){

        this.$refs["carousel"+index.toString()][ix].next();

      },
      prevSlide(ix, index){

        this.$refs["carousel"+index.toString()][ix].prev();

      },

      editPost(postid, title, category, stars, text){

        this.editing = true;
        this.oneedited = postid;

        this.title = title;
        this.category = category;
        this.stars = stars;
        this.text = text;

      },
    setRating: function(rating){
        this.stars= rating;
    },
    async onFileChange(e){

        var files = e.target.files || e.dataTransfer.files;
        this.files = files;


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
    async Edit(postid){

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
      await PostService.editPost(postid, formData).then(()=>{
          this.checkGlobal();
      });
      
      this.editing = false;
      this.media='';
      this.title='';
      this.category='';
      this.files=null;
      this.text='';
      this.stars=1;

    }
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


.post-header{

  background-color: #1e2935;

}


.post-media{

  height: 90%;
  width: 100%;
  max-height: 700px;
  overflow: hidden;
  object-fit: cover;
  margin-top: 3%;
  margin-bottom: 3%;
  

}
.post-card{
  background-color: #1e2935;
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
  width: 60%;
  color: white;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  
}
.post{
  
  background-color: #1e2935;
  margin: auto;
  width: 70%;
  margin-top: 15%;

}

.content{

  margin: auto;
  
}

#container{
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

  width: 40%;
  margin-left: auto;
  margin-right: auto;

}

.Ecategory{
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    color: #e3e7eb;
    background-color: #1e2935;
}

#Estars{

  position: absolute;
  left: 35%;
  
}

#stars{

  margin-left: auto;
  margin-right: auto;

}

.post-text{
  text-align: left;
  margin-top: 5%;
  margin-bottom: 5%;
  text-align: left;
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

  background-color: #222930!important;
  width: 15%;
  margin-left: 3%;
  opacity: 0.5;
}
.navbar.navbar-dark.bg-dark:hover{
  opacity: 1.0;
}
.title{

  margin-top: 1%;
  font-size: 20px;
  margin: auto;
}

.nav-button1{
  position: absolute;
  top: 40%;
  
  
  left: 0.5%;
  height: 25%;
  width: 5%;
  opacity: 0.4;

}

.nav-button2{

  position: absolute;
  top: 40%;
  
  right: 0.5%;
  height: 25%;
  width: 5%;
  opacity: 0.4;

}
.nav-button1:hover,.nav-button2:hover{

    opacity: 0.6;

}
.Etitle{
    color: #e3e7eb;
    background-color: #1e2935;
    width: 95%;
    margin: auto;
}
.media-container{

  position: relative;
  height: 100%;

}

@media screen and (max-width: 1200px) {

    .post{
        width: 75%
    }
    .comments {
  
        background-color: #222930;
        max-height: 8000px;
        overflow: auto;
 

    }
}

@media screen and (max-width: 1000px) {

    .post{
        width: 100%
    }
    .comments {
  
        background-color: #222930;
        max-height: 6000px;
        overflow: auto;
 

    }
    .navbar.navbar-dark.bg-dark{

     background-color: #222930!important;
     width: 10%;
     height: 50%;
     margin-left: 0%;
     opacity: 0.5;
     font-size: 11px;

    }
    #Estars{
        left: 15%;
    }
}
</style>