/*jshint esversion: 6 */
'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '/imports/ui/pages/main.html';
import '/imports/startup/client';

import { writeLog } from '../imports/api/collections/logs';
import { displayError } from '../imports/api/global';

Meteor.startup(() => {

  Accounts.onLogin(() => {
    const user = Meteor.user();
    if (user.first_name && user.last_name) {
      writeLog.call({ userId: user._id, action: 'LOGIN', message: `${user.first_name} ${user.last_name} successfully signed in` }, displayError);
    }
  });

});
