<template>
<div class="container" fluid>

<AdminNav/>


<AdminPosts v-if="getPorA==0"/>

<AdminAccs v-if="getPorA==1"/>

</div>
</template>

<script>
import AdminPosts from './Admin/AdminPosts'
import AdminAccs from './Admin/AdminAccs'
import AdminNav from './Admin/AdminNav'
import { mapGetters } from "vuex";
export default {

    components:{
        AdminPosts,
        AdminNav,
        AdminAccs
    },


    computed:{
        ...mapGetters(["getPorA"])
    }
}
</script>

<style scoped>

.container{
    
    margin: auto;
    width: 100%;

}
html,body {
    margin:0;
    padding:0;
    max-width: 1980px;
    
}

</style>