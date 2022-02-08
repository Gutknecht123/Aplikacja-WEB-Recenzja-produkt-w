<template>
  <div id="app">
    <progress-bar></progress-bar>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import ProgressBar from './components/ProgressBar.vue';

export default {
  name: 'App',
  components: {
    ProgressBar
  }

}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #222930;
  
  
  
  
}
</style>
