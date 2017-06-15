import Vue from 'vue';
import Component from 'vue-class-component';
import Resizer from '../components/Resizer.vue';

@Component({
  name: 'hello',
  components: {
    Resizer
  }
})
export default class Hello extends Vue {
  degree: number = 30;
  left: number = 100;
  top: number = 100;
  width: number = 100;
  height: number = 100;
  handles: string = '';
  draggable: boolean = true;
  rotatable: boolean = true;
  disabled: boolean = false;
  active: boolean = true;

  handleChange(state: Rect) {
    this.left = state.left;
    this.top = state.top;
    this.width = state.width;
    this.height = state.height;
    this.degree = state.rotation;
  }
};
