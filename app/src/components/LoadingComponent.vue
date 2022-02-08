<template>
    
    <div class="page-loader" v-if="!isLoaded">
        <div class="cube"></div>
        <div class="cube"></div>
        <div class="cube"></div>
        <div class="cube"></div>
    </div>

</template>

<script>
export default {
    
    data() {
        return {
            isLoaded: false
        }
    },
    mounted() {
        document.onreadystatechange = () => {
            if(document.readyState == "complete"){
                this.isLoaded = true;
            }
        }
    },

}
</script>
<style lang="scss"  scoped>
    $colors: #cf5454, #31c52c, #d33cba, #32b4d4;

    .page-loader{

        display: flex;
        margin: auto;
        justify-content: center;
        align-items: center;
        position: relative;
        top: 0;
        left: 0;
        width: 50vw;
        height: 40vh;
        background-color: #27323f;
        z-index: 999;

    }

    .cube {
        width: 40px;
        height: 40px;
        margin-right: 10px;
     
        @for $i from 1 through length($colors){
            &:nth-child(#{$i}){
                background-color: nth($colors, $i);
            }
        }
        &:first-child {
            animation: left 1s infinite;
        }   
        &:last-child {
            animation: right 1s infinite .5s;
        }
    }



    @keyframes left{
        40% {
            transform: translateX(-60px);
        }
        50% {
            transform: translateX(0);
        }
    }
    @keyframes right{
        40% {
            transform: translateX(60px);
        }
        50% {
            transform: translateX(0);
        }
    }
</style>