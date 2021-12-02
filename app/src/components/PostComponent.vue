<template>

<div id="container">
<NavbarSection/>

<b-card class="createpost shadow-lg p-3 mb-5 bg-secondary rounded" bg-variant="secondary" text-variant="white" border-variant="light">

<b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
></b-form-textarea>


<b-form-input v-model="category" placeholder="Enter category" id = "category"></b-form-input>
<div v-if="!media">
    <input type="file" v-on:change="onFileChange">
  </div>
  <div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeImage">Remove image</button>
  </div>
 

<b-card-text>
Ocena: <input type="text" v-model="stars" id="stars">
</b-card-text>

<b-button variant="primary" v-on:click="createPost">ADD</b-button>

</b-card>


<p class="error" v-if="error">{{error}}</p>

<div class="posts shadow=lg p-3 mb-5 bg-dark rounded">

<div class="post" v-bind:item="post" v-bind:index = "index" v-bind:key="post._id" v-for="(post, index) in posts">
<b-card :img-src="post.media" img-alt="Card image" img-middle bg-variant="secondary" text-variant="black" border-variant="light">

<b-card-header header-tag="header" header-bg-variant="secondary">
<b-card-text align="left">
<a href="#/user"><img class="creator-img" src="https://preview.redd.it/k1kk9xga1vw61.jpg?width=863&format=pjpg&auto=webp&s=cbae415479b2b36b7a672e9e028cfe3d1466adc1" alt="XD"></a> {{post.creator}}
</b-card-text>
<b-card-text align="right">
{{`${post.createdAt.getDate()}/${post.createdAt.getMonth()}/${post.createdAt.getFullYear()}`}}
</b-card-text>
</b-card-header>


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

<b-button variant="primary" v-if="commsbutton==false" v-on:click="showComments(post._id)">Show Comments</b-button>

<div v-if="selected == post._id">
<div class="comments" v-bind:item="comment" v-bind:index = "index" v-bind:key="comment._id" v-for="(comment, index) in comments">

<b-card-text align="center" v-bind:key = "com" v-for="com in comment.comments" >

{{com.body}}

</b-card-text>

<b-button variant="primary" v-if="commsbutton==true" v-on:click="showComments(post._id)">Hide Comments</b-button>
</div>
</div>
</footer>

</b-card>
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
      filedata: '',
      commsbutton: false,
      selected: ''
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

      formData.append("file", this.filedata);

      await PostService.createPost(this.user, this.text, this.category, this.stars, this.media, formData);
      this.posts = await PostService.getPosts();
      this.media='';
      
    },
    async deletePost(id){
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
    },
     async onFileChange(e) {
      this.filedata = e.target.files[0];
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

        this.commsbutton = !this.commsbutton;
        this.selected = id;
        

        if(this.commsbutton == true){
        this.comments = await CommsService.getComments(id);
        if(this.comments.length == 0){
          this.comments = ["Brak"];
        }
        }
        if(this.commsbutton == false){
          this.selected = '';
          this.comments = [];
        }
    }




  },
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

#container{
  height: 100%;
}

.createpost{

  width: 60%;
  color: white;
  margin-left: auto;
  margin-right: auto;
  
}
.post{
  
  margin: auto;
  width: 60%;
  margin-top: 5%;

}

.content{

  margin: auto;
  

}

#container{
  background-color: #2e363f;
  width: 80%;
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
    resize: none;
    border-radius: 10px;
    width: 40%;
    margin-left: auto;
    margin-right: auto;
}
#category{

  width: 40%;
  margin-left: auto;
  margin-right: auto;

}
</style>
