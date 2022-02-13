<template>
<div class="container">
<NavbarSection />

<PostComponent />
</div>
</template>
<script>

import PostComponent from '../components/PostComponent';
import NavbarSection from '../components/NavbarComponent';
import PostService from '../PostService';
export default {

    components:{
        PostComponent,
        NavbarSection
    },

    data() {
        return {
            posts: []
        }
    },
    async created(){

        this.$store.dispatch('setAuth', true);

        this.posts = await PostService.getPosts(5);

        console.log(this.posts);

        this.$store.dispatch('setPosts', this.posts);

    },

    methods: {
        
    },

    
}
</script>
<style scoped>
.container {
    width: 100vw;
}
</style>