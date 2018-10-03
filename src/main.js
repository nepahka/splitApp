import Vue from 'vue'
import App from './App'
import store from './store'
import Framework7 from 'framework7/framework7.esm.bundle.js'
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js'

import Framework7Styles from 'framework7/css/framework7.css'

Framework7.use(Framework7Vue)

function decimalAdjust (type, value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value)
  }
  value = +value
  exp = +exp
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN
  }
  value = value.toString().split('e')
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
}
if (!Math.round10) {
  Math.round10 = function (value, exp) {
    return decimalAdjust('round', value, exp)
  }
}

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
