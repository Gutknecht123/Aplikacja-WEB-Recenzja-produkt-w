<template>

<div id="container">


<b-container class="nav-buttons mt-5">
<b-row class="mt-5">
<b-col>
</b-col>
</b-row>
<b-row>
<b-col>
<b-button variant="secondary" size="lg" width="95%" v-on:click="searchTitle()">{{phrase}}</b-button>
</b-col>
</b-row>
<b-row>
<b-col>
<b-form-select v-model="chCategory" :options="options" v-on:change="searchCategory()"></b-form-select>
</b-col>
</b-row>
</b-container>

<p class="error" v-if="error">{{error}}</p>
<b-container class="search-cont mt-3">
<Posts/>
</b-container>
</div>



</template>



<script>
import SearchService from '../SearchService';
//import ProfileService from '../ProfileService'
//import PostService from '../PostService'
import Posts from './Posts'
export default { 

    name: 'SearchComponent',
    components:{
    
    Posts
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
      chCategory: '',
      categories: [],
      options: [],
      Loading: false,
      global: 3,
      phrase: ''

     }
 },
    async created(){

try{

      this.phrase = this.$route.params.phrase;

      this.$store.dispatch('setAuth', true);

      console.log(this.$store.state.authenticated);

      this.$store.dispatch('setPostCount', ((-1)*(this.$store.state.postcount-5)));

      let tempposts = await SearchService.searchTitle(this.$route.params.phrase, 5);

      this.$store.dispatch('setPosts', tempposts);

      this.posts = this.$store.state.posts;

      this.categories = await SearchService.getCategories(this.$route.params.phrase);

      for(var i = 0; i<this.categories.data.length; i++){

        this.options.push({ value: this.categories.data[i], text: this.categories.data[i] });

      }

      console.log(this.categories);

    }catch(error){
      //this.error = error.message;
    }


    },
    mounted() {

      this.scroll();
      
    },
    methods: {

    async scroll () {

      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {

          this.$store.dispatch('setPostCount', 5);

          this.Loading = true;
        
          if(this.global==3){
            this.setPosts();
          }else if(this.global==4){
            this.PostsByCat();
          }

        }

        }
       },

      async setPosts(){

        let tempposts = await SearchService.searchTitle(this.$route.params.phrase, this.$store.state.postcount-1);

        if(this.$store.state.posts.length != tempposts.length){

        console.log('Nowe posty123');

        this.$store.dispatch('setPosts', tempposts);

        this.$store.dispatch('setGlobal', this.global);

        }

      },

      async PostsByCat(){

        this.global = 4;

        this.$store.dispatch('setGlobal', this.global);

        let tempposts = await SearchService.searchCategory(this.$route.params.phrase, this.chCategory, this.$store.state.postcount);

        this.$store.dispatch('setPosts', tempposts);

        this.posts = this.$store.state.posts;

      },

    async searchTitle(){

        this.global = 3;

        let tempposts = await SearchService.searchTitle(this.$route.params.phrase, 5);

        this.$store.dispatch('setPosts', tempposts);

        this.posts = this.$store.state.posts;

    },
    async searchCategory(){

        this.global = 4;

        let tempposts = await SearchService.searchCategory(this.$route.params.phrase, this.chCategory, 5);

        this.$store.dispatch('setPosts', tempposts);

        this.posts = this.$store.state.posts;
    },

    },

}



</script>

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

.nav-buttons{
  margin: auto;
  padding-top: 2%;
  width: 40%;
}

.no-posts{

    height: 100em;

}

</style>