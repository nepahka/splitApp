import Vue from 'vue'
import Router from 'vue-router'
import StartScreen from '@/components/screens/StartScreen'
import GroupScreen from '@/components/screens/GroupScreen'
import UserScreen from '@/components/screens/UserScreen'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StartScreen',
      component: StartScreen
    },
    {
      path: '/groups/:id',
      props: true,
      name: 'GroupScreen',
      component: GroupScreen
    },
    {
      path: '/users/:userId',
      name: 'UserScreen',
      component: UserScreen
    }
  ],
  mode: 'history'
})
