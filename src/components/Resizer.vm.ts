import Vue from 'vue';
import Component from 'vue-class-component';
import ResizerState from './resizer-state';
import draggable from './draggable';

const TYPE_PREFIX = 'rr-resizable-';
const HANDLE_SELECTOR = '.rr-resizable-handle';

@Component({
  name: 'rotatable-resizer',

  props: {
    disabled: {
      type: Boolean
    },
    active: {
      type: Boolean,
      default: true
    },
    rotatable: {
      type: Boolean
    },
    draggable: {
      type: Boolean
    },
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
export default class Resizer extends Vue {
  left: number;
  top: number;
  width: number;
  height: number;
  rotation: number;
  handles: string;
  aspectRatio: number;
  rotatable: boolean;
  draggable: boolean;
  disabled: boolean;
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

  created() {
    this.$watch('rotatable', function(val) {
      if (val) {
        this.$nextTick(() => this.bindRotateEvent());
      }
    });

    this.$watch('handles', function() {
      this.$nextTick(() => this.bindResizeEvent());
    });

    const STATE_PROPS = ['width', 'height', 'rotation', 'left', 'top'];
    STATE_PROPS.forEach((prop) => {
      this.$watch(prop, function(val) {
        this.state[prop] = val;
      });
    });
  }

  get rectHandles() {
    const handles = this.handles || 'n,e,s,w,nw,ne,se,sw';
    return handles.split(',').map((handle) => handle.trim());
  }

  get value(): Rect {
    const state = this.state;
    return {
      left: state.left,
      top: state.top,
      width: state.width,
      height: state.height,
      rotation: state.rotation
    };
  }

  hasHandle(ord) {
    return this.rectHandles.indexOf(ord) !== -1;
  }

  mounted() {
    this.bindResizeEvent();
    this.bindDragEvent();
    this.bindRotateEvent();
  }

  bindRotateEvent() {
    const handle = <HTMLElement>this.$refs.rotateHandle;
    if (!handle) return;

    const self = this;
    const el = self.$el;
    draggable(handle, {
      start() {
        if (self.disabled) return false;
      },
      drag(event: MouseEvent) {
        const bounds = el.getBoundingClientRect();
        const center = {
          left: bounds.left + bounds.width / 2,
          top: bounds.top + bounds.height / 2
        };
        self.state.rotation = (Math.atan2(event.clientY - center.top, event.clientX - center.left) * 180 / Math.PI + 90) % 360;
        self.emitInputEvent(self.value);
      },
      end() {
        self.emitChangeEvent();
      }
    });
  }

  bindDragEvent() {
    const self = this;
    const dom = this.$el;
    const dragState: any = {};

    draggable(dom, {
      start(event: MouseEvent) {
        if (!self.draggable || self.disabled) return false;
        dragState.startX = event.clientX;
        dragState.startY = event.clientY;
      },
      drag(event: MouseEvent) {
        const deltaX = event.clientX - dragState.startX;
        const deltaY = event.clientY - dragState.startY;

        const rect = self.state.translate(deltaX, deltaY);
        rect.rotation = self.state.rotation;
        self.emitInputEvent(rect);

        dragState.rect = rect;

        dom.style.left = rect.left + 'px';
        dom.style.top = rect.top + 'px';
        dom.style.width = rect.width + 'px';
        dom.style.height = rect.height + 'px';
      },
      end() {
        if (dragState.rect) {
          self.state.reset(dragState.rect);
          self.emitChangeEvent();
        }
      }
    });
  }

  emitInputEvent(rect: Rect) {
    this.$emit('input', rect);
  }

  emitChangeEvent() {
    const rect: Rect = this.value;
    this.$emit('change', rect);
  }

  bindResizeEvent() {
    const self = this;
    const dom = this.$el;

    let aspectRatio = self.aspectRatio;

    if (typeof aspectRatio !== 'number') {
      aspectRatio = undefined;
    }

    const handles = dom.querySelectorAll(HANDLE_SELECTOR);

    for (let i = 0, j = handles.length; i < j; i++) {
      this.makeHandleResizable(<HTMLElement>handles[i]);
    }
  }

  private makeHandleResizable(handle: HTMLElement) {
    const self = this;
    const el = this.$el;
    const type = handle.className.split(' ')[1].replace(TYPE_PREFIX, '');

    let resizeState: any = {};
    let startPoint;

    draggable(handle, {
      start(event: MouseEvent) {
        if (self.disabled) return false;
        resizeState.startX = event.clientX;
        resizeState.startY = event.clientY;
        startPoint = self.state.getPoint(<PointType>type);
      },
      drag(event: MouseEvent) {
        const deltaX = event.clientX - resizeState.startX;
        const deltaY = event.clientY - resizeState.startY;

        const rect = self.state.dragPoint(type, deltaX, deltaY, startPoint);
        resizeState.rect = rect;

        rect.rotation = self.state.rotation;
        self.emitInputEvent(rect);

        if (rect.left !== undefined) {
          el.style.left = rect.left + 'px';
          el.style.top = rect.top + 'px';
        }

        if (rect.width !== undefined) {
          el.style.width = rect.width + 'px';
          el.style.height = rect.height + 'px';
        }
      },
      end() {
        if (resizeState.rect) {
          self.state.reset(resizeState.rect);
          self.emitChangeEvent();
        }
      }
    });
  }
};
