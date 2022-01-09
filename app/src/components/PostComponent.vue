<template>

<div id="container">
<NavbarSection/>
<form @submit.prevent="createPost" method="post" enctype="multipart/form-data">
<b-card class="createpost shadow-lg p-3 mb-5 rounded" text-variant="white" border-variant="dark">

<b-row class="mb-3">
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

<b-row class="mb-3">
<b-col>

<b-form-input v-model="category" placeholder="Enter category" id = "category"></b-form-input>

</b-col>
</b-row>

<b-row class="mb-3">
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

<b-row class="mb-3">
<b-col>

<b-card-text>
Ocena: <input type="text" v-model="stars" id="stars">
</b-card-text>

</b-col>
</b-row>

<b-row class="mb-3">
<b-col>
<b-button variant="secondary" size="sm" type="submit">Publish</b-button>
</b-col>
</b-row>


</b-card>
</form>

<p class="error" v-if="error">{{error}}</p>

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
</div>


</template>

<script>
import PostService from '../PostService';
import CommsService from '../CommsService';
import AccountService from '../AccountService';
import NavbarSection from './NavbarComponent';

//import useStore from 'vuex';
export default {
  name: 'PostComponent',
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
      commenttext: ''
    }
  },
  async created(){

    

    try{

      this.posts = await PostService.getPosts();

      

      const response = await AccountService.getuserAccount();

      this.user = response.data.login;

      this.$store.dispatch('setAuth', true);

      console.log(this.$store.state.authenticated);

      

    }catch(error){
      this.$store.dispatch('setAuth', false);
      
      this.error = error.message;
    }
  },
  methods: {
    async createPost(){ 

      const formData = new FormData();
      const f = [];

      formData.append('creator', this.user);
      formData.append('text', this.text);
      formData.append('category', this.category);
      formData.append('stars', this.stars);
      formData.append('media', this.media);
      formData.append('likes', 0);

    
      console.log(this.files);
     for (const i of Object.keys(this.files)) {
           formData.append('files', this.files[i])
           f.push(this.files[i].name)
          }
      
      //console.log(formData.get('files'));
      console.log(f[0]);
      await PostService.createPost(formData);
      this.posts = await PostService.getPosts();
      this.media='';

      
      
    },
    async deletePost(id){
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
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

      reader.onload = () => {
        //this.media = e.target.result;
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


      this.$store.dispatch('setProfile', profile);

      this.$router.push('/user/'+profile);

    }


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
  
  background-color: #181d22;

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
  flex-direction: column-reverse;
}

.createpost{

  background-color: #1e2935;
  width: 60%;
  color: white;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5%;
  
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
  background-color:#181d22;
 
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
</style>
