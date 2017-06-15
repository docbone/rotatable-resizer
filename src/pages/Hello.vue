<template>
  <div class="playground columns col-gapless">
    <div class="column col-3" style="padding: 0;">
      <div class="form-header">Options</div>
      <form class="form-horizontal">
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Rotatable</label>
          <label class="form-checkbox col-7">
            <input type="checkbox" v-model="rotatable">
            <i class="form-icon"></i>
          </label>
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Draggable</label>
          <label class="form-checkbox col-7">
            <input type="checkbox" v-model="draggable">
            <i class="form-icon"></i>
          </label>
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Disabled</label>
          <label class="form-checkbox col-7">
            <input type="checkbox" v-model="disabled">
            <i class="form-icon"></i>
          </label>
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Active</label>
          <label class="form-checkbox col-7">
            <input type="checkbox" v-model="active">
            <i class="form-icon"></i>
          </label>
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Handles</label>
          <select class="form-select col-7" v-model="handles">
            <option value="">All</option>
            <option value="nw,ne,se,sw">Corners</option>
            <option value="e,w">Horizontal</option>
            <option value="n,s">Vertical</option>
          </select>
        </div>
      </form>

      <div class="form-header">State</div>
      <form class="form-horizontal">
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Degree</label>
          <input class="form-input" type="number" placeholder="Degree" v-model.number="degree">
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Left</label>
          <input class="form-input" type="number" placeholder="Left" v-model.number="left">
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Top</label>
          <input class="form-input" type="number" placeholder="Top" v-model.number="top">
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Width</label>
          <input class="form-input" type="number" placeholder="Width" v-model.number="width">
        </div>
        <div class="form-group">
          <label class="form-label col-5" for="input-example-1">Height</label>
          <input class="form-input" type="number" placeholder="Height" v-model.number="height">
        </div>
      </form>
    </div>
    <div class="playground-content column col-9 empty">
      <resizer
        :active="active"
        :rotatable="rotatable"
        :draggable="draggable"
        :disabled="disabled"
        :handles="handles"
        :rotation="degree"
        @change="handleChange"
        :left="left"
        :top="top"
        :width="width"
        :height="height">
        Slot Content
      </resizer>
    </div>

  </div>
</template>

<script lang='ts'>
import Hello from "./Hello.vm";
export default Hello;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .playground {
    height: 100%;
  }
  .form-label {
    padding-top: .8rem;
  }
  .form-header {
    background: #f8f9fa;
    padding: .8rem;
    margin: .5rem;
  }
  .playground-content {
    position: relative;
  }
</style>
