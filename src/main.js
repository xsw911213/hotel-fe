// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';

// import {
//   //Style,
//   Button,
//   Checkbox,
//   CheckboxGroup,
//   Loading,
//   Tip,
//   Popup,
//   Toast,
//   Picker,
//   TimePicker,
//   Dialog,
//   ActionSheet,
//   Scroll,
//   Slide,
//   IndexList
// } from 'cube-ui'

import Cube from 'cube-ui'

Vue.use(Cube)

Vue.prototype.axios = axios;
// Vue.use(Button)
// Vue.use(Checkbox)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
