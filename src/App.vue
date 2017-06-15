<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang='ts'>
import 'spectre.css';
import App from './App.vm.ts';
export default App;
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

html, body {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>
