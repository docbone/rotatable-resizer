import Vue from 'vue';

import Hello from '../../../src/pages/Hello.vue';
import { expect } from 'chai';
describe('Hello.vue', () => {
  it('should render correct contents', () => {
    // surprisingly this test needs to be setup with a template and components param in the vue extend method, WHY??????
    // when running th s test with  following 2 lines it will BREAK:
    // const Constructor = Vue.extend(Hello);
    // const vm = new Constructor().$mount();

    // we can only fix this test by using following 2 lines:
    //  const Constructor = Vue.extend({ template: '<div><hello></hello></div>', components: { 'hello': Hello } });
    //  const vm = new Constructor().$mount();

    const vm = new Hello();
    vm.$mount();
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App');
    let resultFromMyMethod = (<any>vm).mymethod();
    expect(resultFromMyMethod).to.equal('ok');

  });
});


