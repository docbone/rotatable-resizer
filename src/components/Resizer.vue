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

<style>
.rr-resizer {
  position: absolute;
  box-sizing: border-box;
  left: 0;
  top: 0;
}

.rr-resizer-content {
  width: 100%;
  height: 100%;
}

.rr-rotatable-handle {
  position: absolute;
  left: 50%;
  top: -16px;
  border: 1px solid #666;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  transform: translate(-50%, -50%);
}

.rr-resizable-handle {
  box-sizing: border-box;
  position: absolute;
  border: 1px solid #666;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  transform: translate(-50%, -50%);
}

.rr-resizable-n {
  cursor: n-resize;
  left: 50%;
  top: 0;
}

.rr-resizable-s {
  cursor: s-resize;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
}

.rr-resizable-e {
  cursor: e-resize;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
}

.rr-resizable-w {
  cursor: w-resize;
  left: 0;
  top: 50%;
}

.rr-resizable-nw {
  cursor: nw-resize;
  left: 0;
  top: 0;
  border-color: blue;
}

.rr-resizable-ne {
  cursor: ne-resize;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
}

.rr-resizable-se {
  cursor: se-resize;
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%);
}

.rr-resizable-sw {
  cursor: sw-resize;
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
}
</style>

<script lang="ts">
import ResizerState from './resizer-state';
import draggable from './draggable';

const getPosition = function(element: HTMLElement): { left: number, top: number } {
  const selfRect = element.getBoundingClientRect();
  const parentRect = element.offsetParent.getBoundingClientRect();

  return {
    left: selfRect.left - parentRect.left,
    top: selfRect.top - parentRect.top
  };
};

export default {
  name: 'rect',

  props: {
    handles: {
      type: String
    },
    left: {
      type: Number
    },
    top: {
      type: Number
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    rotation: {
      type: Number
    }
  },

  computed: {
    rectHandles() {
      const handles = this.handles || 'n,e,s,w,nw,ne,se,sw';
      return handles.split(',').map((handle) => handle.trim());
    }
  },

  methods: {
    hasHandle(ord) {
      const rectHandles = this.rectHandles;
      return rectHandles.indexOf(ord) !== -1;
    },
    bindRotatable() {
      const handle = this.$el.querySelector('.rr-rotatable-handle');
      const dragState: any = {};
      const self = this;

      draggable(handle, {
        start(event: MouseEvent) {
          dragState.startLeft = event.clientX;
          dragState.startTop = event.clientY;
        },
        drag(event: MouseEvent) {
          const deltaX = event.clientX - dragState.startLeft;
          const deltaY = event.clientY - dragState.startTop;

          const center = self.state.center;
          const degree = (Math.atan2(event.clientY - center.top, event.clientX - center.left) * 180 / Math.PI + 90) % 360;

          self.state.rotation = degree;
        },
        end() {
          if (dragState.rect) {
          }
        }
      });
    },

    bindDraggable() {
      const self = this;
      const dom = this.$el;
      const dragState: any = {};

      draggable(dom, {
        start(event: MouseEvent) {
          dragState.startLeft = event.clientX;
          dragState.startTop = event.clientY;
        },
        drag(event: MouseEvent) {
          const deltaX = event.clientX - dragState.startLeft;
          const deltaY = event.clientY - dragState.startTop;

          const rect = self.state.translate(deltaX, deltaY);

          dragState.rect = rect;

          dom.style.left = rect.left + 'px';
          dom.style.top = rect.top + 'px';
          dom.style.width = rect.width + 'px';
          dom.style.height = rect.height + 'px';
        },
        end() {
          if (dragState.rect) {
            self.state.reset(dragState.rect);
          }
        }
      });
    },

    bindResizeEvent() {
      const self = this;
      const dom = this.$el;
      let resizeState: any = {};
      let aspectRatio = self.aspectRatio;

      if (typeof aspectRatio !== 'number') {
        aspectRatio = undefined;
      }

      const makeResizable = function(bar: HTMLElement) {
        const type = bar.className.split(' ')[1].replace('rr-resizable-', '');

        draggable(bar, {
          start(event: MouseEvent) {
            resizeState.startLeft = event.clientX;
            resizeState.startTop = event.clientY;
          },
          drag(event: MouseEvent) {
            const deltaX = event.clientX - resizeState.startLeft;
            const deltaY = event.clientY - resizeState.startTop;

            const rect = self.state.dragPoint(type, deltaX, deltaY, {
              left: resizeState.startLeft,
              top: resizeState.startTop
            });

            resizeState.rect = rect;

            if (rect.left !== undefined) {
              dom.style.left = rect.left + 'px';
              dom.style.top = rect.top + 'px';
            }
            if (rect.width !== undefined) {
              dom.style.width = rect.width + 'px';
              dom.style.height = rect.height + 'px';
            }
          },
          end() {
            if (resizeState.rect) {
              self.state.reset(resizeState.rect);
            }
          }
        });
      };

      const handles = dom.querySelectorAll('.rr-resizable-handle');

      for (let i = 0, j = handles.length; i < j; i++) {
        makeResizable(<HTMLElement>handles[i]);
      }
    }
  },

  mounted() {
    this.bindResizeEvent();
    this.bindDraggable();
    this.bindRotatable();
  },

  watch: {
    left(val) {
      this.state.left = val;
    },
    top(val) {
      this.state.top = val;
    },
    width(val) {
      this.state.width = val;
    },
    height(val) {
      this.state.height = val;
    },
    rotation(val) {
      this.state.rotation = val;
    }
  },

  data() {
    const state = new ResizerState({
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height
    }, this.rotation);

    return {
      state
    };
  }
};
</script>
