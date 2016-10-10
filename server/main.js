'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { logError } from '../imports/api/global';

const gmailUrl = Meteor.settings.private.gmail;

Meteor.startup(() => {
  process.env.MAIL_URL = gmailUrl;

  Meteor.onConnection((conn) => {

  });

  Accounts.onCreateUser((options, user) => {

    return user;
  });

  Accounts.validateLoginAttempt((parms) => {

    return true;
  });

  //TODO put fast render routes here
});
