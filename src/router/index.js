import Vue from 'vue'
import Router from 'vue-router'
import StartScreen from '@/components/screens/StartScreen'
import GroupScreen from '@/components/screens/GroupScreen'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StartScreen',
      component: StartScreen
    },
    {
      path: '/group/:id',
      props: true,
      name: 'GroupScreen',
      component: GroupScreen
    }
  ],
  mode: 'history'
})
