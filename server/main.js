'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { moment } from 'meteor/momentjs:moment';

import '../imports/api/collections/families';
import '../imports/api/collections/gifts';
import '../imports/api/collections/holidays';
import '../imports/api/collections/logs';
import '../imports/api/collections/system';
import '../imports/api/collections/users';
import { getDayOfMonth, getMonth, logError } from '../imports/api/global';
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
    let firstName = EMPTY_VAL,
        lastName = EMPTY_VAL,
        email = EMPTY_VAL,
        verified = true,
        profile = options.profile || {},
        birthday, birthMonth, birthDayOfMonth, fullName, existingUser, logEntry;
    if (user.services.facebook) {
      firstName = user.services.facebook.first_name;
      lastName = user.services.facebook.last_name;
      email = user.services.facebook.email;
    } else if (user.services.google) {
      firstName = user.services.google.given_name;
      lastName = user.services.google.family_name;
      email = user.services.google.email;
    } else {
      firstName = profile.firstName;
      delete profile.firstName;
      lastName = profile.lastName;
      delete profile.lastName;
      profile.name = `${firstName} ${lastName}`;
      email = options.email;
      birthday = moment(profile.birthday).toDate();
      delete profile.birthday;
      birthMonth = getMonth(birthday);
      birthDayOfMonth = getDayOfMonth(birthday);
      verified = false;
    }
    existingUser = Meteor.users.findOne({ "registered_emails.address": email });
    if (existingUser) {
// pull out all pieces of new
      user = existingUser;
// if missing or service is email, overwrite user values
/* old service - service merge code
const meldedUser = Object.assign({}, newUser, origUser);
*/
/* old password - service merge code
let firstName = user.first_name,
    lastName = user.last_name,
    fullName = user.profile && user.profile.name;
if (serviceName === 'facebook') {
  firstName = firstName || user.services.facebook.first_name;
  lastName = lastName || user.services.facebook.last_name;
  fullName = fullName || `${firstName} ${lastName}`;
} else if (serviceName === 'google') {
  firstName = firstName || user.services.google.given_name;
  lastName = lastName || user.services.google.family_name;
  fullName = fullName || `${firstName} ${lastName}`;
}
*/
      Meteor.users.remove({ _id: existingUser._id });
    }
    user.profile = profile;
    user.first_name = firstName;
    user.last_name = lastName;
    user.email = email;
    user.birthday = birthday;
    user.birth_month = birthMonth;
    user.birth_month_day = birthDayOfMonth;
    user.verified = verified;
    user.done_registering = false;
    fullName = (firstName && lastName ? `${firstName} ${lastName}` : 'An unknown user');
    writeLog.call({ userId: user._id, action: 'REGISTER', message: `${fullName} registered with email ${email}` }, logError);
    return user;
  });

  Accounts.validateLoginAttempt((parms) => {

    return true;
  });

  //TODO put fast render routes here
});
