'use strict';

import { Meteor } from 'meteor/meteor';
import { Router, nativeScrollBehavior } from 'meteor/akryum:vue-router2';
import { Session } from 'meteor/session';

import { displayError } from './global';
import { writeLog } from './collections/logs';

// Components
import GiftMaint from '../ui/GiftMaint.vue';
import Home from '../ui/Home.vue';
import Login from '../ui/Login.vue';
import MyList from '../ui/MyList.vue';
import NotFound from '../ui/NotFound.vue';
import OtherLists from '../ui/OtherLists.vue';
import Registration from '../ui/Registration.vue';
import Settings from '../ui/Settings.vue';
import ShoppingList from '../ui/ShoppingList.vue';

// Create router instance
const router = new Router({
  mode: 'history',
  scrollBehavior: nativeScrollBehavior
});

const requireAuth = (to, from, next) => {
  const userId = Meteor.userId();
  if (!userId) { // No user signed in, redirect to signin screen
    Session.set('redirect', to.fullPath);
    next('/login');
  } else { // Already signed in, let them pass
    next();
  }
};

const requireNoAuth = (to, from, next) => {
  const userId = Meteor.userId(),
      user = Meteor.user();
  if (!userId) { // No user signed in, let them pass
    next();
  } else if (to.path === '/logout') { // User is trying to sign out
    Meteor.logout(err => {
      writeLog.call({ userId: user._id, action: 'LOGOUT', message: `${user.first_name} ${user.last_name} successfully signed out` }, displayError);
      Object.keys(Session.keys).forEach(key => Session.set(key, undefined));
      Session.keys = {};
      next();
    });
  } else { // User is signed in, redirect to home
    next('/');
  }
};

Router.configure(router => {
  router.addRoutes([{
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    alias: ['/register', '/logout'],
    beforeEnter: requireNoAuth
  },
  {
    path: '/register/:step',
    name: 'registration',
    component: Registration,
    beforeEnter: requireAuth
  },
  {
    path: '/my-list',
    name: 'my-list',
    component: MyList,
    beforeEnter: requireAuth
  },
  {
    path: '/other-lists',
    name: 'other-lists',
    component: OtherLists,
    beforeEnter: requireAuth
  },
  {
    path: '/shopping-list',
    name: 'shopping-list',
    component: ShoppingList,
    beforeEnter: requireAuth
  },
  {
    path: '/gift/:id',
    name: 'gift-maint',
    component: GiftMaint,
    beforeEnter: requireAuth
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    beforeEnter: requireAuth
  },
  {
    path: '*',
    component: NotFound
  }]);
});

export default router;
