import Vue from 'vue';
import Component from 'vue-class-component';
import ResizerState from './resizer-state';
import draggable from './draggable';

@Component({
  name: 'rotatable-resizer',

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
  }
})
export default class Hello extends Vue {
  left: number;
  top: number;
  width: number;
  height: number;
  rotation: number;
  handles: string;
  aspectRatio: number;
  state: ResizerState;

  data() {
    const state: ResizerState = new ResizerState({
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height
    }, this.rotation);

    return {
      state
    };
  }

  watch = {
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
  };

  get rectHandles() {
    const handles = this.handles || 'n,e,s,w,nw,ne,se,sw';
    return handles.split(',').map((handle) => handle.trim());
  }

  mounted() {
    this.bindResizeEvent();
    this.bindDraggable();
    this.bindRotatable();
  }

  hasHandle(ord) {
    const rectHandles = this.rectHandles;
    return rectHandles.indexOf(ord) !== -1;
  }

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
  }

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
  }

  bindResizeEvent() {
    const self = this;
    const dom = this.$el;
    let resizeState: any = {};
    let aspectRatio = self.aspectRatio;

    if (typeof aspectRatio !== 'number') {
      aspectRatio = undefined;
    }

    const makeResizable = function(handle: HTMLElement) {
      const type = handle.className.split(' ')[1].replace('rr-resizable-', '');

      draggable(handle, {
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
};
