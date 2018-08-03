import Vue from 'vue'
import Router from 'vue-router'
import StartScreen from '@/components/screens/StartScreen'
import GroupScreen from '@/components/screens/GroupScreen'
import UserScreen from '@/components/screens/UserScreen'
import UsersForm from '@/components/forms/UsersForm'
import GroupsForm from '@/components/forms/GroupsForm'
import PaymentForm from '@/components/forms/PaymentForm'
import PaymentFormUsers from '@/components/forms/paymentForm/PaymentFormUsers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StartScreen',
      component: StartScreen,
      children: [
        {
          path: 'groups/:id',
          props: true,
          name: 'GroupScreen',
          component: GroupScreen,
          children: [
            {
              path: 'addpayment',
              name: 'PaymentForm',
              component: PaymentForm,
              children: [
                {
                  path: 'paidby',
                  name: 'PaymentFormUsers',
                  component: PaymentFormUsers
                }
              ]
            }
          ]
        },
        {
          path: 'users/:userId',
          name: 'UserScreen',
          component: UserScreen
        },
        {
          path: 'adduser',
          name: 'UsersForm',
          component: UsersForm
        },
        {
          path: 'addgroup',
          name: 'GroupsForm',
          component: GroupsForm
        }
      ]
    }
  ],
  mode: 'hash'
})
