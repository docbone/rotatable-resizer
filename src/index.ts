import Resizer from './components/Resizer.vue';

export default Resizer;

function install(Vue) {
  Vue.component(Resizer.name, Resizer);
}

if (typeof window !== 'undefined' && window['Vue']) {
  install(window['Vue']);
}
