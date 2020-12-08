import Vue from 'vue'
import App from './App.vue'
import './styles.css'

Vue.config.productionTip = false

Vue.filter('round', function(value) {
  if (!value) return 'N/A';
  value = +parseFloat(value.toString()).toFixed(2);
  return '' + value;
})

new Vue({
  render: h => h(App),
}).$mount('#app')
