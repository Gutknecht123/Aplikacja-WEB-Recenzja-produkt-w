<template>

<div class="container">
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">NavBar</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>

        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
<div class="grid-container">

</div>
<div class="createpost">


<p><b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
    ></b-form-textarea></p>

<div class="createpost-flex">

<p><b-form-input v-model="category" placeholder="Enter category" id = "category"></b-form-input></p>
<div v-if="!media">
    <input type="file" v-on:change="onFileChange">
  </div>
  <div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeImage">Remove image</button>
  </div>
  <br>
<p>Ocena: <input type="text" v-model="stars" id="stars"></p>

</div>
<b-button variant="outline-dark" v-on:click="createPost">ADD</b-button>
</div>

<p class="error" v-if="error">{{error}}</p>

<div class="posts"> 

<div class="post" v-bind:item="post" v-bind:index = "index" v-bind:key="post._id" v-for="(post, index) in posts">

{{`${post.createdAt.getDate()}/${post.createdAt.getMonth()}/${post.createdAt.getFullYear()}`}}
<div class="post-flex">
<p class="media"><a href="#/user"><img class="creator-img" src="https://preview.redd.it/k1kk9xga1vw61.jpg?width=863&format=pjpg&auto=webp&s=cbae415479b2b36b7a672e9e028cfe3d1466adc1" alt="XD"></a></p>
<p class="creator">{{post.creator}}</p>
<p class="category">Category: {{post.category}}</p>
</div>
<p class="content">{{post.text}}</p>
<p class="likes">{{post.likes}}</p>
<p class="stars">{{post.stars}}</p>
<p><img class="media-img" :src="post.media" alt="XD"></p>
<button v-on:click="deletePost(post._id)">DELETE</button>
</div>
</div>
<button>SHOW MORE</button>
</div>


</template>

<script>
import PostService from '../PostService';
export default {
  name: 'PostComponent',
  data(){
    return { 
      posts: [],
      error: '',
      text: '',
      media: '',
      category: '',
      stars: ''
    }
  },
  async created(){
    try{
      this.posts = await PostService.getPosts();
    }catch(error){
      this.error = error.message;
    }
  },
  methods: {
    async createPost(){ 
      await PostService.createPost(this.text, this.category, this.stars, this.media);
      this.posts = await PostService.getPosts();
      this.media='';
    },
    async deletePost(id){
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
    },
     async onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    async createImage(file) {
      //var media = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.media = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage:async function () {
      this.media = '';
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

.createpost{

  width: 60%;
  border: 3px solid blue;
  color: white;
  margin-left: auto;
  margin-right: auto;
  
}
.post{
  
  margin: auto;
  border: 3px solid blue;
  background-color: #0066CC;
  width: 60%;
  margin-top: 5%;
  border-radius: 20px;

}
.posts{

  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  

}
.post-flex{

  display: flex;
  flex-direction: row;
  margin-left: 15%;

}
.content{

  margin: auto;
  text-align: left;
  width: 80%;

}

.container{
  background-color: #2e363f;
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

.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
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
