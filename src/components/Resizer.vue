<template>
  <div class="rr-resizer"
    :class="{
      'rr-resizer--active': !disabled && active,
      'rr-drag-border': dragMode === 'border'
    }"
    :style="{
      transform: 'rotateZ(' + state.rotation + 'deg)',
      left: state.left + 'px',
      top: state.top + 'px',
      width: state.width + 'px',
      height: state.height + 'px'
     }">
    <div class="rr-bar rr-ord-n" key="bar-n"></div>
    <div class="rr-bar rr-ord-s" key="bar-s"></div>
    <div class="rr-bar rr-ord-e" key="bar-e"></div>
    <div class="rr-bar rr-ord-w" key="bar-w"></div>
    <div class="rr-rotate-handle" v-if="rotatable" ref="rotateHandle"></div>
    <div class="rr-handle rr-ord-n" v-if="hasHandle('n')" key="ord-n"></div>
    <div class="rr-handle rr-ord-s" v-if="hasHandle('s')" key="ord-s"></div>
    <div class="rr-handle rr-ord-e" v-if="hasHandle('e')" key="ord-e"></div>
    <div class="rr-handle rr-ord-w" v-if="hasHandle('w')" key="ord-w"></div>
    <div class="rr-handle rr-ord-nw" v-if="hasHandle('nw')" key="ord-nw"></div>
    <div class="rr-handle rr-ord-ne" v-if="hasHandle('ne')" key="ord-ne"></div>
    <div class="rr-handle rr-ord-se" v-if="hasHandle('se')" key="ord-se"></div>
    <div class="rr-handle rr-ord-sw" v-if="hasHandle('sw')" key="ord-sw"></div>
    <div class="rr-content">
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
