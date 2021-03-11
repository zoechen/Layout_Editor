import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueKonva from 'vue-konva';
import VueLodash from 'vue-lodash';
import lodash from 'lodash';
 
Vue.use(VueLodash, { name: 'custom' , lodash: lodash });

Vue.use(VueKonva);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
