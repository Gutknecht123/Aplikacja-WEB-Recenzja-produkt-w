<template>
<div>
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
</b-col>
</b-row>
</b-card-header>

<div class="title" align="center">{{post.title}}</div>

<div class="media-container">  

<VueSlickCarousel :ref="'carousel'+index" :adaptiveHeight="true" :swipe="true" :arrows ="false" :swipeToSlide="true" v-if="post.files.length > 1">
<div v-bind:key = "image" v-bind:index="ix" v-for="(image, ix) in post.files" fluid>

    <div v-if="image.split('.').pop()=='mp4'" align="center" >

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
<b-button align="left" variant="secondary" size="md" v-if="commsbutton==false || (commsbutton==true && selected != post._id)" v-on:click="showComments(post._id)">Show Comments</b-button>
</b-col> 
<b-col>
<b-card-text>


{{post.likedby.length-1}}
<b-button variant="secondary" size="md" :disabled="isDisabled" v-on:click="likePost(post._id)" v-if="post.likedby.filter(e => e.username === user).length == 0">Like</b-button>
<b-button variant="secondary" size="md" :disabled="isDisabled" v-on:click="unlikePost(post._id)" v-if="post.likedby.filter(e => e.username === user).length > 0">Unlike</b-button>


</b-card-text>
</b-col>
</b-row> 

</footer>

</b-card>

<b-card class="comments shadow-lg p-3 mt-5 rounded" text-variant="white" border-variant="dark" v-if="selected == post._id">



<div class="comments1" v-if="selected == post._id">

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


<div class="comments2 border border-dark" v-bind:item="comment" v-bind:index = "index" v-bind:key="comment._id" v-for="(comment, index) in comments">

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
</template>