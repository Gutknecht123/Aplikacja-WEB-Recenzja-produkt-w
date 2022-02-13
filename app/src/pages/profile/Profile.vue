<template>
<div>
<NavbarSection />
<ProfileComponent />
</div>
</template>
<script>

import ProfileComponent from '../components/ProfileComponent';
import PostService from '../PostService';
import NavbarSection from '../components/NavbarComponent';
export default {

    components:{
        ProfileComponent,
        NavbarSection
    },
    data() {
        return {
            posts: []
        }
    },
    async created(){

        this.posts = await PostService.getUserPosts(this.$route.params.profile, 5);

        this.$store.dispatch('setPosts', this.posts);

    },

    methods: {
        
    },
}
</script>