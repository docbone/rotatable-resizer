<template>
  <div class="rr-resizer"
    :class="{
      'rr-resizer--active': !disabled && active
    }"
    :style="{
      transform: 'rotateZ(' + state.rotation + 'deg)',
      left: state.left + 'px',
      top: state.top + 'px',
      width: state.width + 'px',
      height: state.height + 'px',
     }">
    <div class="rr-rotatable-handle" v-if="rotatable" ref="rotateHandle"></div>
    <div class="rr-resizable-handle rr-resizable-n" v-if="hasHandle('n')" key="ord-n"></div>
    <div class="rr-resizable-handle rr-resizable-s" v-if="hasHandle('s')" key="ord-s"></div>
    <div class="rr-resizable-handle rr-resizable-e" v-if="hasHandle('e')" key="ord-e"></div>
    <div class="rr-resizable-handle rr-resizable-w" v-if="hasHandle('w')" key="ord-w"></div>
    <div class="rr-resizable-handle rr-resizable-nw" v-if="hasHandle('nw')" key="ord-nw"></div>
    <div class="rr-resizable-handle rr-resizable-ne" v-if="hasHandle('ne')" key="ord-ne"></div>
    <div class="rr-resizable-handle rr-resizable-se" v-if="hasHandle('se')" key="ord-se"></div>
    <div class="rr-resizable-handle rr-resizable-sw" v-if="hasHandle('sw')" key="ord-sw"></div>
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
