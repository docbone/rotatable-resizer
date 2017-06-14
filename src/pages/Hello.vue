<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      Rotatable: <input type="checkbox" v-model="rotatable" />
    </div>
    <div>
      Disabled: <input type="checkbox" v-model="disabled" />
    </div>
    <div>
      Active: <input type="checkbox" v-model="active" />
    </div>
    <input v-model.number="left" type="number" />
    <button @click="handles = ''">handles</button>
    <resizer
      @mousedown.native="active = true"
      handles1="nw,ne,sw,se"
      handles2="e,w"
      :active="active"
      :disabled="disabled"
      :handles="handles"
      :rotatable="rotatable"
      draggable
      :rotation="degree"
      :left="left"
      :top="100"
      :width="100"
      :height="100">
      Test
    </resizer>
  </div>
</template>

<script lang='ts'>
import Hello from "./Hello.vm";
export default Hello;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
