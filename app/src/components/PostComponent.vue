<template>

<div class="container">
<div class="grid-container">

</div>
<div class="createpost">


<p><textarea rows="10" cols="100" id="createpost" v-model="text"></textarea></p>
<div class="createpost-flex">
<p>Kategoria: <input type="text" v-model="category" id="category"></p>
<div v-if="!media">
    <input type="file" v-on:change="onFileChange">
  </div>
  <div v-else>
    <p><img :src="media" class="post-img" /></p>
    <button v-on:click="removeImage">Remove image</button>
  </div>
<p>Ocena: <input type="text" v-model="stars" id="stars"></p>

</div>
<button v-on:click="createPost">ADD</button>
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

  border: 3px solid blue;
  color: white;
  
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

.category{


  margin-left: 50%;
  margin-bottom: 5%;

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
  background-color: #2c3e50;
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
textarea {
    resize: none;
    border-radius: 10px;
}
</style>
