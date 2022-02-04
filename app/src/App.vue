<template>
  <div id="app">
    <loading-section></loading-section>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import LoadingSection from './components/LoadingComponent.vue';

export default {
  name: 'App',
  components: {
    LoadingSection
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
