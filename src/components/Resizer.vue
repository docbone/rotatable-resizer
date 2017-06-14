<template>
  <div class="rr-resizer" :style="{
    transform: 'rotateZ(' + state.rotation + 'deg)',
    left: state.left + 'px',
    top: state.top + 'px',
    width: state.width + 'px',
    height: state.height + 'px',
  }">
    <div class="rr-rotatable-handle"></div>
    <div class="rr-resizable-handle rr-resizable-n" v-if="hasHandle('n')"></div>
    <div class="rr-resizable-handle rr-resizable-s" v-if="hasHandle('s')"></div>
    <div class="rr-resizable-handle rr-resizable-e" v-if="hasHandle('e')"></div>
    <div class="rr-resizable-handle rr-resizable-w" v-if="hasHandle('w')"></div>
    <div class="rr-resizable-handle rr-resizable-nw" v-if="hasHandle('nw')"></div>
    <div class="rr-resizable-handle rr-resizable-ne" v-if="hasHandle('ne')"></div>
    <div class="rr-resizable-handle rr-resizable-se" v-if="hasHandle('se')"></div>
    <div class="rr-resizable-handle rr-resizable-sw" v-if="hasHandle('sw')"></div>
    <div class="rr-resizer-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import './resizer.scss';
</style>

<script lang="ts">
import ResizerVM from './Resizer.vm';
export default ResizerVM;
</script>
