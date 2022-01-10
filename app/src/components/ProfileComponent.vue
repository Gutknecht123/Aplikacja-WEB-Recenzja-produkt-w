<template>
<div id="container">
   <NavbarSection/>

<b-container fluid class="profile-bannerpic border-bottom border-dark" :style="{'background-image':'url(https://i.imgur.com/ZJLIU8U.png)', 'background-size':'110%'}">
<b-row>
<b-col cols="4" align-self="start">
   <img src="https://i.imgur.com/VeDVeor.jpg" alt="" class="profile-pic border-bottom border-dark" align="right"/>
</b-col>
<b-col cols="8">
   
</b-col>
</b-row>
</b-container>

<b-container fluid>

<b-row>
<b-col cols="3">
<div>
<b-row>
<b-col :style="{'text-align': 'right', 'font-size': '25px'}">
{{username}}
</b-col> 
</b-row>
<b-row>
<b-col>
<b-button variant="secondary" size="lg" >Follow</b-button>
</b-col> 
</b-row>
</div> 
</b-col>
<b-col cols="6">
<div class="posts shadow=lg p-3 mb-5 rounded">

<div class="post" v-bind:item="post" v-bind:index = "index" v-bind:key="post._id" v-for="(post, index) in posts">
<b-card text-variant="white" border-variant="dark" class="post-card">

<b-card-header header-tag="header" class="post-header">
<b-card-text align="left">
<img class="creator-img" src="https://preview.redd.it/k1kk9xga1vw61.jpg?width=863&format=pjpg&auto=webp&s=cbae415479b2b36b7a672e9e028cfe3d1466adc1" alt="XD" @click="Gotoprofile(post.creator)"> {{post.creator}}
</b-card-text>
<b-card-text align="right">
{{`${post.createdAt.getFullYear()}-${post.createdAt.getMonth()}-${post.createdAt.getDate()}`}}
</b-card-text>
</b-card-header>

<div v-bind:key = "image" v-for="image in post.files">
<b-card-img :src="image" class="post-media rounded-0"></b-card-img>
</div>

<b-card-text>
{{post.category}}
</b-card-text>
<b-card-text>
{{post.text}}
</b-card-text>
<b-card-text>
{{post.stars}}
</b-card-text>


<footer>

<b-card-text align="right">
{{post.likes}}
</b-card-text>

<b-button variant="secondary" v-if="commsbutton==false || (commsbutton==true && selected != post._id)" v-on:click="showComments(post._id)">Show Comments</b-button>

</footer>

</b-card>

<b-card class="comments shadow-lg p-3 mb-5 rounded" text-variant="white" border-variant="dark">



<div class="comments" v-if="selected == post._id">

<b-container class="bv-example-row">
<b-row class="mb-3">
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
<b-row class="mb-3">

<b-col>
<b-button  variant="secondary" size="sm" v-on:click="addComment(selected)">Publish</b-button>
</b-col>

</b-row>
</b-container>


<div class="comments border border-dark" v-bind:item="comment" v-bind:index = "index" v-bind:key="comment._id" v-for="(comment, index) in comments">

<div class="comment border border-dark" v-bind:key = "com" v-for="com in comment.comments">
<b-container class="comm bv-example-row">
<b-row class="mb-3">
<b-col>
<b-card-text align="left">

{{com.creator}}

</b-card-text>
</b-col>

<b-col class="mb-3">
<b-card-text align="right">

{{com.createdAt.substring(0,10)}}

</b-card-text>
</b-col>

</b-row>

<b-row align-v="stretch" class="mb-3">
<b-col align-self="stretch">
<b-card-text align="left">

{{com.body}}

</b-card-text>
</b-col>
</b-row>
<b-row>

<b-col class="mb-3">
<b-button variant="secondary" size="sm" v-if="com.creator==user" v-on:click="deleteComment(comment._id, com._id, selected)">Delete comment</b-button>
</b-col>

</b-row>

</b-container>
</div>
</div>

</div>

<b-button class="mb-3" variant="secondary" size="sm" v-if="commsbutton==true && selected == post._id" v-on:click="hideComments()">Hide Comments</b-button>


</b-card>

<b-button variant="secondary" size="sm" v-if="post.creator==user" v-on:click="deletePost(post._id)">Delete review</b-button>

</div>
</div>
</b-col>
</b-row>
</b-container>

</div>

</template>

<script>

import PostService from '../PostService';
import CommsService from '../CommsService';
import AccountService from '../AccountService';
import NavbarSection from './NavbarComponent';

export default {
    name: 'ProfileComponent',
   components:{
     NavbarSection,
     
 },
  data(){
      return {
      posts: [],
      comments: [],
      error: '',
      text: '',
      media: '',
      category: '',
      stars: '',
      user: '',
      files: null,
      commsbutton: false,
      selected: '',
      commenttext: '',
      username: ''
      }
  },
  async created(){

    

    try{


      const response = await AccountService.getuserAccount();

      const username = await AccountService.getUsername(this.$route.params.profile);

      this.username = username.data.login;

      this.user = response.data.login;

      this.$store.dispatch('setAuth', true);

      //console.log(this.$store.state.authenticated);

      console.log(this.$store.state.profile);

      this.posts = await PostService.getUserPosts(this.$route.params.profile);

    }catch(error){
      this.$store.dispatch('setAuth', false);
      
      this.error = error.message;
    }
  },
  methods: {

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
     async deletePost(id){
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
    },
      async Gotoprofile(profile){


        console.log(profile);

    }

  }
}
</script>

<style scoped>

.profile-banner {

    
    height: 400px;
}

#container{

    background-color:#181d22;
 
    margin-left: auto;
    margin-right: auto;

}

.profile-pic{

    width: 30%;
    margin-top: 35%;

}

.creator-img{

  width: 50px;
  border-radius: 25px;

}

.post-img{

  width: 25%;

}

.content{

  margin: auto;
  

}

.post{
  
  background-color: #1e2935;
  margin: auto;
  width: 100%;
  margin-top: 1%;
  margin-left: 45%;

}

.posts {
  display: flex;
  flex-direction: column-reverse;
}

.comment {

  margin-top: 5%;
  background-color: #1e2935;

}

.comments {
  
  background-color: #181d22;

}

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

#textarea {

    color: #e3e7eb;
    background-color: #1e2935;
    border-radius: 10px;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
}
</style>