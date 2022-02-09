<template>

<ProfileComponent :posts="posts" />

</template>
<script>

import ProfileComponent from '../components/ProfileComponent';
import PostService from '../PostService';

export default {

    components:{
        ProfileComponent
    },
    data() {
        return {
            posts: []
        }
    },
    async created(){

        this.posts = await PostService.getUserPosts(this.$route.params.profile);

        this.$store.dispatch('setPosts', this.posts);

    },

    methods: {
        
    },
}
</script>