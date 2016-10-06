/*jshint esversion: 6 */
'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Vue from 'vue';
import router from '/imports/routes';

// App layout
import AppLayout from '/imports/ui/AppLayout.vue';

// App start
Meteor.startup(() => {

  // Start the router
  new Vue({
    router: router.start(),
    render: h => h(AppLayout),
  }).$mount('app');

  Accounts.onLogin(() => {
    const user = Meteor.user();
    if (user.first_name && user.last_name) {
      writeLog.call({ userId: user._id, action: 'LOGIN', message: `${user.first_name} ${user.last_name} successfully signed in` }, displayError);
    }
  });

});
