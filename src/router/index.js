import Vue from 'vue'
import Router from 'vue-router'
import StartScreen from '@/components/StartScreen'
// import AddPaymentForm from '@/components/AddPaymentForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StartScreen',
      component: StartScreen
    }
    // ,
    // {
    //   path: '/addpayment',
    //   name: 'AddPaymentForm',
    //   component: AddPaymentForm
    // }
  ]
})
