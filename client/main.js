/*jshint esversion: 6 */
'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Vue from 'vue';
import router from '../imports/api/routes';

// App layout
import AppLayout from '../imports/ui/AppLayout.vue';

// App start
Meteor.startup(() => {

  // Start the router
  const routes = router.start();

  routes.beforeEach((to, from, next) => {
    const userId = Meteor.userId();
    let doneRegistering = true;
    if (!userId) {
      next();
      return;
    }
    //TODO they are logged in, check if they've finished registration
    if (doneRegistering) {
      next();
    } else {
      //TODO if they haven't finished registering, send them to the right step here
    }
  });

  const vue = new Vue({
    router: routes,
    render: h => h(AppLayout),
  }).$mount('app');

  Accounts.onLogin(() => {
    const user = Meteor.user();
    if (user.first_name && user.last_name) {
      writeLog.call({ userId: user._id, action: 'LOGIN', message: `${user.first_name} ${user.last_name} successfully signed in` }, displayError);
    }
  });

});
