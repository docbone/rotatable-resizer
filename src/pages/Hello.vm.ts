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
  handles: string = 'nw,ne,sw,se';
  msg: string = 'Welcome to Your Vue.js App';
  rotatable: boolean = false;
  disabled: boolean = false;
  active: boolean = true;

  mymethod(): string {
    console.log('here we are');
    return 'ok';
  }
};
