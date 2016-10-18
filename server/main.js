'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { logError } from '../imports/api/global';
import { writeLog } from '../imports/api/collections/logs';

const gmailUrl = Meteor.settings.private.gmail;

Meteor.startup(() => {
  process.env.MAIL_URL = gmailUrl;

  Meteor.onConnection(conn => {
    //TODO remove and fix code below
    console.log(`New connection ${conn}`);
    /*const systemVal = SystemVal.findOne();
    let newConn = {
      opened: new Date(),
      on_view_my_picks: false,
      on_view_all_picks: false,
      scoreboard_open: false
    };
    systemVal.current_connections[conn.id] = newConn;
    systemVal.save();
    conn.onClose(() => {
      delete systemVal.current_connections[conn.id];
      systemVal.save();
    });*/
  });

  Accounts.onCreateUser((options, user) => {
    const EMPTY_VAL = '';
    let first_name = EMPTY_VAL,
        last_name = EMPTY_VAL,
        email = EMPTY_VAL,
        verified = true,
        existingCount, fullName, logEntry;
    if (user.services.facebook) {
      first_name = user.services.facebook.first_name;
      last_name = user.services.facebook.last_name;
      email = user.services.facebook.email;
    } else if (user.services.google) {
      first_name = user.services.google.given_name;
      last_name = user.services.google.family_name;
      email = user.services.google.email;
    } else {
      email = options.email;
      verified = false;
    }
    user.profile = options.profile || {};
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.verified = verified;
    user.done_registering = false;
    fullName = (first_name && last_name ? `${first_name} ${last_name}` : 'An unknown user');
    writeLog.call({ userId: user._id, action: 'REGISTER', message: `${fullName} registered with email ${email}` }, logError);
    return user;
  });

  Accounts.validateLoginAttempt((parms) => {

    return true;
  });

  //TODO put fast render routes here
});
