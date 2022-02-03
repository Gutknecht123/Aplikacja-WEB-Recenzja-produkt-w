<template>

<div>
<NavbarSection/>
<div id="container">
<form @submit.prevent="createPost" method="post" enctype="multipart/form-data">
<b-card class="createpost shadow-lg p-3 mt-5 rounded" text-variant="white" border-variant="dark">

<b-row class="mt-3">
<b-col>
<b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      auto-shrink
      no-resize
      
></b-form-textarea>
</b-col>
</b-row>

<b-row class="mt-3">
<b-col>

<b-form-input v-model="category" placeholder="Enter category" id = "category"></b-form-input>

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

<b-row>

<b-col>
<star-rating v-bind:increment="0.5"
             v-bind:max-rating="5"
             inactive-color="#0099cc"
             active-color="#ffcc66"
             v-bind:rating="1"
             v-bind:show-rating="false"
             v-bind:star-size="40" v-model="stars" id="stars" @rating-selected="setRating"></star-rating>

</b-col>
</b-row>

<b-row class="mt-3">
<b-col>
<b-button variant="secondary" size="sm" type="submit">Publish</b-button>
</b-col>
</b-row>


</b-card>
</form>

<p class="error" v-if="error">{{error}}</p>

<b-tabs content-class="mt-3" fill>

<b-tab title="Global" v-on:click="globalPosts()"  active>

<div class="posts shadow=lg p-3 mt-5 rounded">

<div class="post" v-bind:item="post" v-bind:index = "index" v-bind:key="post._id" v-for="(post, index) in posts">
<b-card text-variant="white" border-variant="dark" class="post-card">

<b-card-header header-tag="header" class="post-header">
<b-row>
<b-col>
<b-card-text align="left">
<img class="creator-img" src="https://preview.redd.it/k1kk9xga1vw61.jpg?width=863&format=pjpg&auto=webp&s=cbae415479b2b36b7a672e9e028cfe3d1466adc1" alt="XD" @click="Gotoprofile(post.creator)"> {{post.creator}}
</b-card-text>
</b-col>
<b-col>
<b-card-text align="right">
{{`${post.createdAt.getFullYear()}-${post.createdAt.getMonth()}-${post.createdAt.getDate()}`}}
</b-card-text>
</b-col>
</b-row>
</b-card-header>

<VueSlickCarousel :adaptiveHeight="true" :swipe="false">



<div v-bind:key = "image" v-bind:index="ix" v-for="(image, ix) in post.files">


    <div align="center">
    <b-card-img :src="image" class="post-media rounded-0" v-if="image.split('.').pop()!='mp4'" contain height="600px"></b-card-img>
    </div>

    <div v-if="image.split('.').pop()=='mp4'">

    <video-player class="vjs-custom-skin" 
                  ref="videoPlayer"
                  :options="playerOptions[index]"
                  :playsinline="true"
                  >
    </video-player>
    </div>
    
</div>

    <template #prevArrow="arrowOption">
      <div class="custom-arrow">
        {{ arrowOption.currentSlide }}/{{ arrowOption.slideCount }}
      </div>
    </template>

</VueSlickCarousel>



<b-container class="post-content">
<b-row class="stars-cat">
<b-col>
<b-card-text align="left">
Rating: <star-rating v-bind:increment="0.5"
              v-bind:max-rating="5"
              inactive-color="#1e2935"
              active-color="#ffcc66"
              v-bind:rating="post.stars"
              v-bind:read-only="true"
              v-bind:show-rating="false"
              v-bind:star-size="30" class="stars"></star-rating>
</b-card-text>


</b-col>
<b-col>
<b-card-text align="right">
Category:
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
<b-button align="left" variant="secondary" size="sm" v-if="commsbutton==false || (commsbutton==true && selected != post._id)" v-on:click="showComments(post._id)">Show Comments</b-button>
</b-col> 
<b-col>
<b-card-text>
{{post.likes}} <b-button variant="secondary" size="sm" v-on:click="likePost(post._id)">Like</b-button>
</b-card-text>
</b-col>
</b-row> 

</footer>

</b-card>

<b-card class="comments shadow-lg p-3 mt-5 rounded" text-variant="white" border-variant="dark" v-if="selected == post._id">



<div class="comments" v-if="selected == post._id">

<b-container class="bv-example-row">
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


<div class="comments border border-dark" v-bind:item="comment" v-bind:index = "index" v-bind:key="comment._id" v-for="(comment, index) in comments">

<div class="comment border border-dark" v-bind:key = "com" v-for="com in comment.comments">
<b-container class="comm bv-example-row">
<b-row class="mt-3">
<b-col>
<b-card-text align="left">

{{com.creator}}

</b-card-text>
</b-col>

<b-col class="mt-3">
<b-card-text align="right">

{{com.createdAt.substring(0,10)}}

</b-card-text>
</b-col>

</b-row>

<b-row align-v="stretch" class="mt-3">
<b-col align-self="stretch">
<b-card-text align="left">

{{com.body}}

</b-card-text>
</b-col>
</b-row>
<b-row>

<b-col class="mt-3">
<b-button variant="secondary" size="sm" v-if="com.creator==user" v-on:click="deleteComment(comment._id, com._id, selected)">Delete comment</b-button>
</b-col>

</b-row>

</b-container>
</div>
</div>

</div>

<b-button class="mt-3" variant="secondary" size="sm" v-if="commsbutton==true && selected == post._id" v-on:click="hideComments()">Hide Comments</b-button>


</b-card>

<b-button variant="secondary" size="sm" v-if="post.creator==user" v-on:click="deletePost(post._id)">Delete review</b-button>

</div>
</div>

</b-tab>
<b-tab title="Follows" v-on:click="followsPosts()">

<div class="posts shadow=lg p-3 mt-5 rounded">

<div class="post" v-bind:item="post" v-bind:index = "index" v-bind:key="post._id" v-for="(post, index) in posts">
<b-card text-variant="white" border-variant="dark" class="post-card">

<b-card-header header-tag="header" class="post-header">
<b-row>
<b-col>
<b-card-text align="left">
<img class="creator-img" src="https://preview.redd.it/k1kk9xga1vw61.jpg?width=863&format=pjpg&auto=webp&s=cbae415479b2b36b7a672e9e028cfe3d1466adc1" alt="XD" @click="Gotoprofile(post.creator)"> {{post.creator}}
</b-card-text>
</b-col>
<b-col>
<b-card-text align="right">
{{`${post.createdAt.getFullYear()}-${post.createdAt.getMonth()}-${post.createdAt.getDate()}`}}
</b-card-text>
</b-col>
</b-row>
</b-card-header>

<VueSlickCarousel :adaptiveHeight="true" :swipe="false">



<div v-bind:key = "image" v-bind:index="ix" v-for="(image, ix) in post.files">


    <div align="center">
    <b-card-img :src="image" class="post-media rounded-0" v-if="image.split('.').pop()!='mp4'"></b-card-img>
    </div>

    <div v-if="image.split('.').pop()=='mp4'">

    <video-player class="vjs-custom-skin" 
                  ref="videoPlayer"
                  :options="playerOptions[index]"
                  :playsinline="true"

                  >
    </video-player>
    </div>
    
</div>

    <template #prevArrow="arrowOption">
      <div class="custom-arrow">
        {{ arrowOption.currentSlide }}/{{ arrowOption.slideCount }}
      </div>
    </template>

</VueSlickCarousel>



<b-container class="post-content">
<b-row class="stars-cat">
<b-col>
<b-card-text align="left">
Rating: <star-rating v-bind:increment="0.5"
              v-bind:max-rating="5"
              inactive-color="#1e2935"
              active-color="#ffcc66"
              v-bind:rating="post.stars"
              v-bind:read-only="true"
              v-bind:show-rating="false"
              v-bind:star-size="30" class="stars"></star-rating>
</b-card-text>


</b-col>
<b-col>
<b-card-text align="right">
Category:
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
<b-button align="left" variant="secondary" size="sm" v-if="commsbutton==false || (commsbutton==true && selected != post._id)" v-on:click="showComments(post._id)">Show Comments</b-button>
</b-col> 
<b-col>
<b-card-text>
{{post.likes}} <b-button variant="secondary" size="sm" v-on:click="likePost(post._id)">Like</b-button>
</b-card-text>
</b-col>
</b-row> 

</footer>

</b-card>

<b-card class="comments shadow-lg p-3 mt-5 rounded" text-variant="white" border-variant="dark" v-if="selected == post._id">



<div class="comments" v-if="selected == post._id">

<b-container class="bv-example-row">
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


<div class="comments border border-dark" v-bind:item="comment" v-bind:index = "index" v-bind:key="comment._id" v-for="(comment, index) in comments">

<div class="comment border border-dark" v-bind:key = "com" v-for="com in comment.comments">
<b-container class="comm bv-example-row">
<b-row class="mt-3">
<b-col>
<b-card-text align="left">

{{com.creator}}

</b-card-text>
</b-col>

<b-col class="mt-3">
<b-card-text align="right">

{{com.createdAt.substring(0,10)}}

</b-card-text>
</b-col>

</b-row>

<b-row align-v="stretch" class="mt-3">
<b-col align-self="stretch">
<b-card-text align="left">

{{com.body}}

</b-card-text>
</b-col>
</b-row>
<b-row>

<b-col class="mt-3">
<b-button variant="secondary" size="sm" v-if="com.creator==user" v-on:click="deleteComment(comment._id, com._id, selected)">Delete comment</b-button>
</b-col>

</b-row>

</b-container>
</div>
</div>

</div>

<b-button class="mt-3" variant="secondary" size="sm" v-if="commsbutton==true && selected == post._id" v-on:click="hideComments()">Hide Comments</b-button>


</b-card>

<b-button variant="secondary" size="sm" v-if="post.creator==user" v-on:click="deletePost(post._id)">Delete review</b-button>

</div>
</div>

</b-tab>
</b-tabs>

</div>

<div class="pagefooter shadow-lg p-3 mt-5 rounded">
<b-navbar toggleable="md" type="dark" variant="dark" fixed="bottom" v-if="tothetop==true">
<b-button variant="secondary" size="lg" v-on:click="scrollToTop()">Go to top</b-button>
</b-navbar>
</div>
</div>

</template>

<script>
import PostService from '../PostService';
import CommsService from '../CommsService';
import AccountService from '../AccountService';
import NavbarSection from './NavbarComponent';
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import StarRating from 'vue-star-rating'
import ProfileService from '../ProfileService';


//import useStore from 'vuex';
export default {
  name: 'PostComponent',
   components:{
     NavbarSection,
     VueSlickCarousel,
     StarRating
     
 },
  data(){
    return { 
      posts: [],
      comments: [],
      error: '',
      text: '',
      media: '',
      category: '',
      stars: 0,
      user: '',
      files: null,
      commsbutton: false,
      selected: '',
      commenttext: '',
      playerOptions: [],
      medialist:[],
      PostCount: 5,
      follows: [],
      global: true,
      tothetop: false,

    }
  },
  async created(){

    

    try{



      this.posts = await PostService.getPosts(this.PostCount);

      const response = await AccountService.getuserAccount();

      

      this.user = response.data.login;

      this.$store.dispatch('setAuth', true);

      console.log(this.$store.state.authenticated);


      for(var i=0; i<this.posts.length; i++){

        for(var j=0; j<this.posts[i].files.length; j++){

          //console.log(this.posts[i].files[j]);

          if(this.posts[i].files[j].split('.').pop()=='mp4'){
          let arrs = {

            playbackRates: [1.0, 2.0, 3.0], //Broadcasting speed
            autoplay: false, //If true, the browser will start playing back when it is ready.
            muted: true, // Any audio will be removed by default.
            loop: false, // Causes the video to restart as soon as it's over.
            preload: "auto", // It is recommended that the browser start downloading video data after < video > loading elements. auto browser selects the best behavior and starts loading the video immediately (if supported by the browser)
            language: "en-EN",
            aspectRatio: "16:9", // Place the player in fluid mode and use this value when calculating the dynamic size of the player. The value should represent a scale - two numbers separated by colons (for example, "16:9" or "4:3")
            fluid: true,
            sources: [{
            type: "video/mp4",
            src: this.posts[i].files[j]
            }],
            poster: "",
            notSupportedMessage: "This video can't be played temporarily. Please try again later", //Allows you to override the default information displayed when Video.js is unable to play the media source.
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //Full screen button
              }
          }

      
          this.playerOptions[i] = arrs;
          
          }

          
        }

      }




      
    }catch(error){
      this.$store.dispatch('setAuth', false);
      
      this.error = error.message;
    }
  },
    mounted() {

      this.scroll();

    },
    computed: {

    },

     methods: {

    async createPost(){ 

      const formData = new FormData();
      const f = [];

      formData.append('creator', this.user);
      formData.append('text', this.text);
      formData.append('category', this.category);
      formData.append('stars', this.stars);
      formData.append('likes', 0);

    
      console.log(this.files);
     for (const i of Object.keys(this.files)) {
           formData.append('files', this.files[i])
           f.push(this.files[i].name)
          }
      
      //console.log(formData.get('files'));
      console.log(f[0]);
      await PostService.createPost(formData);
      this.posts = await PostService.getPosts(this.PostCount);
      this.media='';

      for(var i=0; i<this.posts.length; i++){

        for(var j=0; j<this.posts[i].files.length; j++){

          //console.log(this.posts[i].files[j]);

          if(this.posts[i].files[j].split('.').pop()=='mp4'){
          let arrs = {

            playbackRates: [1.0, 2.0, 3.0], //Broadcasting speed
            autoplay: false, //If true, the browser will start playing back when it is ready.
            muted: false, // Any audio will be removed by default.
            loop: false, // Causes the video to restart as soon as it's over.
            preload: "auto", // It is recommended that the browser start downloading video data after < video > loading elements. auto browser selects the best behavior and starts loading the video immediately (if supported by the browser)
            language: "zh-CN",
            aspectRatio: "16:9", // Place the player in fluid mode and use this value when calculating the dynamic size of the player. The value should represent a scale - two numbers separated by colons (for example, "16:9" or "4:3")
            fluid: true,
            sources: [{
            type: "video/mp4",
            src: this.posts[i].files[j]
            }],
            poster: "",
            notSupportedMessage: "This video can't be played temporarily. Please try again later", //Allows you to override the default information displayed when Video.js is unable to play the media source.
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //Full screen button
              }
          }

      
          this.playerOptions[i] = arrs;
          
          }

          
        }

      }
      
    },

    setRating: function(rating){
      this.stars= rating;
    },

    async deletePost(id){
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts(this.PostCount);
    },
     async onFileChange(e) {
      this.files = e.target.files;
      
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    async createImage(file) {
      //var media = new Image();
      var reader = new FileReader();
      //var vm = this;

      reader.onload = (e) => {
        this.media = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage:async function () {
      this.media = '';
    },

    async showComments(id){

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


      //this.$store.dispatch('setProfile', profile);

      this.$router.push('/user/'+profile);

    },

    async likePost(postid){

      try{

      await PostService.Like(postid, this.user);
      this.posts = await PostService.getPosts(this.PostCount);

      }catch(e){

        console.log(e);
      }


    },

    async scroll () {
      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {

        this.PostCount += 5;

        console.log(this.PostCount);

          if(this.global){
            this.setPosts();
          }else if(!this.global){
            this.followsPosts();
          }
        }

        console.log(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop));

        if(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)>=500){
              this.tothetop = true;
        }else if (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)<500){
              this.tothetop = false;
        }
      

        }
       },

      async setPosts(){

        let tempposts = await PostService.getPosts(this.PostCount-1);

        if(this.posts.length != tempposts.length){
        
        this.posts = tempposts;

        for(var i=0; i<this.posts.length; i++){

          for(var j=0; j<this.posts[i].files.length; j++){

          //console.log(this.posts[i].files[j]);

              if(this.posts[i].files[j].split('.').pop()=='mp4'){
              let arrs = {

                playbackRates: [1.0, 2.0, 3.0], //Broadcasting speed
                autoplay: false, //If true, the browser will start playing back when it is ready.
                muted: true, // Any audio will be removed by default.
                loop: false, // Causes the video to restart as soon as it's over.
                preload: "auto", // It is recommended that the browser start downloading video data after < video > loading elements. auto browser selects the best behavior and starts loading the video immediately (if supported by the browser)
                language: "en-EN",
                aspectRatio: "16:9", // Place the player in fluid mode and use this value when calculating the dynamic size of the player. The value should represent a scale - two numbers separated by colons (for example, "16:9" or "4:3")
                fluid: true,
                sources: [{
                type: "video/mp4",
                src: this.posts[i].files[j]
                }],
                poster: "",
                notSupportedMessage: "This video can't be played temporarily. Please try again later", //Allows you to override the default information displayed when Video.js is unable to play the media source.
                  controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true //Full screen button
                  }
              }

          
              this.playerOptions[i] = arrs;
              
          }

          
        }

      }



        }
  //


      },
      async globalPosts(){

        this.global = true;

        this.PostCount = 5;

        this.setPosts();

      },
      async followsPosts(){

        this.global = false;

        this.follows = await ProfileService.getFollows(this.user);

        
        //var tempposts = await PostService.getfollowsPosts(this.follows.data.Followings);
        console.log("tu");

        console.log(this.follows.data.Followings);

      
        this.posts = await PostService.getfollowsPosts(this.follows.data.Followings, this.PostCount);







        
        /////////////////////////////////////////////////////
        for(var i=0; i<this.posts.length; i++){

          for(var j=0; j<this.posts[i].files.length; j++){

          //console.log(this.posts[i].files[j]);

              if(this.posts[i].files[j].split('.').pop()=='mp4'){
              let arrs = {

                playbackRates: [1.0, 2.0, 3.0], //Broadcasting speed
                autoplay: false, //If true, the browser will start playing back when it is ready.
                muted: true, // Any audio will be removed by default.
                loop: false, // Causes the video to restart as soon as it's over.
                preload: "auto", // It is recommended that the browser start downloading video data after < video > loading elements. auto browser selects the best behavior and starts loading the video immediately (if supported by the browser)
                language: "en-EN",
                aspectRatio: "16:9", // Place the player in fluid mode and use this value when calculating the dynamic size of the player. The value should represent a scale - two numbers separated by colons (for example, "16:9" or "4:3")
                fluid: true,
                sources: [{
                type: "video/mp4",
                src: this.posts[i].files[j]
                }],
                poster: "",
                notSupportedMessage: "This video can't be played temporarily. Please try again later", //Allows you to override the default information displayed when Video.js is unable to play the media source.
                  controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true //Full screen button
                  }
              }

          
              this.playerOptions[i] = arrs;
              
          }

          
        }

      }
        console.log(this.posts);

        console.log(await PostService.getPosts(this.PostCount));
        console.log(await PostService.getfollowsPosts(this.follows.data.Followings));

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

  width: 90%;
  margin-bottom: 5%;
  

}
.post-card{
  background-color: #1e2935;
}
.comments {
  
  background-color: #222930;

}
.comment {

  margin-top: 5%;
  background-color: #1e2935;

}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
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
  width: 60%;
  margin-top: 5%;

}

.content{

  margin: auto;
  

}

#container{
  background-color:#222930;
 
  margin-left: auto;
  margin-right: auto;
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

#stars{

  margin-left: auto;
  margin-right: auto;

}

.post-text{
  text-align: left;
  margin-top: 5%;
  margin-bottom: 10%;
}

.stars-cat{

  margin-top: 3%;


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

</style>
<style>

.slick-prev:before,
            .slick-next:before {
                font-size: 20px;
                line-height: 1;
                opacity: 0.75;
                color: red !important;

                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        

</style>