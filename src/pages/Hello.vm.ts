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
  msg: string = 'Welcome to Your Vue.js App';

  mymethod(): string {
    console.log('here we are');
    return 'ok';
  }
};
