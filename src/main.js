import Vue from 'vue'
import App from './App.vue'
import './styles.css'

Vue.config.productionTip = false

Vue.filter('round', function(value, unit = '') {
  if (!value) {
    if (unit === '') {
      return 'N/A';
    } else {
      return `0${unit}`;
    }
  }
  value = +parseFloat(value.toString()).toFixed(2);
  return value + unit;
})

new Vue({
  render: h => h(App),
}).$mount('#app')
