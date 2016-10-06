'use strict';

import { Router, nativeScrollBehavior } from 'meteor/akryum:vue-router2';

// Components
import Home from '/imports/ui/Home.vue';
import MyList from '/imports/ui/MyList.vue';
import NotFound from '/imports/ui/NotFound.vue';

// Create router instance
const router = new Router({
  mode: 'history',
  scrollBehavior: nativeScrollBehavior
});

Router.configure(router => {
  router.addRoutes([
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/my-list',
      name: 'my-list',
      component: MyList
    },
    {
      path: '*',
      component: NotFound
    }
  ]);
});

export default router;
