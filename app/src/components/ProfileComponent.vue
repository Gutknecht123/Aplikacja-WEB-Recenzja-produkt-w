<template>
<div id="container">


<b-container class="mt-5">
<b-img class="banner-img" :src="banner" fluid alt="No image"></b-img>
<b-card text-variant="white" border-variant="dark" class="profile-card mt-2" align="center">

<b-avatar size="150px" class="avatar"><b-card-img :src="profilepic" alt="" class="profile-pic border-bottom border-dark"></b-card-img></b-avatar>

<b-card-text align="center" class="mt-3">

{{username}}

</b-card-text>
<b-card-text align="center" class="mt-3">

{{description}}

</b-card-text>
<b-row >
<b-col v-if="username!=user && check==false && isLoggedIn">
<b-button variant="secondary" size="md" v-on:click="Follow()" >Follow</b-button>
</b-col>
<b-col v-if="username!=user && check==true && isLoggedIn">
<b-button variant="secondary" size="md" v-on:click="Unfollow()" >Unfollow</b-button>
</b-col>
</b-row>

</b-card>
</b-container>

<b-container>

<b-row>
<b-col>


</b-col>
</b-row>
<b-row>
<b-col>
<div class="posts shadow=lg mb-5 rounded">

<Posts/>

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
//import NavbarSection from './NavbarComponent';
import ProfileService from '../ProfileService';
import SettingsService from '../SettingsService';
//import VueSlickCarousel from 'vue-slick-carousel';
import Posts from './Posts';
import { mapGetters } from "vuex";
export default {
    name: 'ProfileComponent',
   components:{
     
     Posts
     
 },
 props: [],
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
      username: '',
      check: null,
      playerOptions: [],
      medialist:[],
      banner: '',
      profilepic: '',
      description: ''
      }
  },
  computed:{
        ...mapGetters(["isLoggedIn"]),
        ...mapGetters(["getUser"])
  },
  async created(){

    

    try{

      this.$store.dispatch('setPostCount', ((-1)*(this.$store.state.postcount-5)));

      const userProfile = await SettingsService.getProfile(this.$route.params.profile);

      this.banner = userProfile.data[0].banner;

      this.profilepic = userProfile.data[0].profilePic;

      this.description = userProfile.data[0].description;

      this.$store.dispatch('setAuth', true);

      const username = await AccountService.getUsername(this.$route.params.profile);

      this.username = username.data.login;

      this.user = this.$store.state.user;

      this.check = await ProfileService.Check(this.user, this.username);

      this.$store.dispatch('setGlobal', 2);



    }catch(error){
      this.$store.dispatch('setAuth', false);
      
      this.error = error.message;
    }
  },
  mounted() {

      this.scroll();
      
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

      async Follow(){

        
        await ProfileService.Follow(this.user, this.username);
        this.check = await ProfileService.Check(this.user, this.username)

      },
      async Unfollow(){

        await ProfileService.Unfollow(this.user, this.username);
        this.check = await ProfileService.Check(this.user, this.username)
      },

      async scroll () {
      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {

          this.$store.dispatch('setPostCount', 5);

          this.Loading = true;
        
          this.setOwnPosts();

        }

        }
       },

       async setOwnPosts(){

          let tempposts =  await PostService.getUserPosts(this.$route.params.profile, this.$store.state.postcount)

          this.$store.dispatch('setPosts',tempposts);
       }

  }
}
</script>

<style scoped>

#container{

    background-color:#222930;
    margin-left: auto;
    margin-right: auto;
   
}

.profile-pic{

  height: 100%;
  width: 100%;
  object-fit: cover;
    
}

.posts{

  width: 100%;
  margin: auto;

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

.profile-card{

  margin: auto;
  width: 35%;
  background-color: #1e2935;
  
}

.comment {

  margin-top: 5%;
  background-color: #1e2935;

}

.comments {
  
  background-color: #222930;

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
.profile-bannerpic{

  height: 330px;

}
.banner-img{

  height: 100%;
  width: 100%;
  max-height: 329px;
  margin: auto;

}
@media screen and (max-width: 1200px) {

    .posts{

      width: 85%;
      margin: auto;

    }
}
@media screen and (max-width: 1000px) {

    .posts{

      width: 100%;
      margin: auto;

    }
    .profile-card{

      width: 100%;
     
    }

}
</style>