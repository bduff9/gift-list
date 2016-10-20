/*jshint esversion: 6 */
'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Vue from 'vue';

import router from '../imports/api/routes';
import { displayError } from '../imports/api/global';
import { writeLog } from '../imports/api/collections/logs';
import AppLayout from '../imports/ui/AppLayout.vue';

// App start
Meteor.startup(() => {

  // Start the router
  const routes = router.start();

  // Start vue instance
  const vue = new Vue({
    router: routes,
    render: h => h(AppLayout),
  }).$mount('app');

  // Log sign ins
  Accounts.onLogin(() => {
    const user = Meteor.user();
    if (user.first_name && user.last_name) {
      writeLog.call({ userId: user._id, action: 'LOGIN', message: `${user.first_name} ${user.last_name} successfully signed in` }, displayError);
    }
  });

});
