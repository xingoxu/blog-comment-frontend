// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue';
import globalData from './components/globalData.js';

window.comments = function (el) {
  globalData.set(el);
  let vm = new Vue({
    el: el,
    template: '<App />',
    components: { App }
  });
  return {
    destroy() {
      vm.$destroy();
    }
  }
}

let comment = document.getElementById('comments');
comment ? comments(comment) : false;
