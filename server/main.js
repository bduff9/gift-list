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
    console.log('New connection', conn);
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
console.log('user', user);
    const EMPTY_VAL = '',
        service = Object.keys(user.services)[0];
    let firstName = EMPTY_VAL,
        lastName = EMPTY_VAL,
        email = EMPTY_VAL,
        verified = true,
        profile = options.profile || {},
        existingUser = Meteor.user(),
        overwrite = service === 'password',
        birthday, birthMonth, birthDayOfMonth, fullName, serviceObj, logEntry;
    if (service === 'facebook') {
      firstName = user.services.facebook.first_name;
      lastName = user.services.facebook.last_name;
      email = user.services.facebook.email;
    } else if (service === 'google') {
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
    existingUser = existingUser || Meteor.users.findOne({ "email": email });
    if (existingUser) {
console.log('existingUser', existingUser);
      serviceObj = user.services[service];
      if (!existingUser.services[service]) existingUser.services[service] = serviceObj;
      Meteor.users.remove({ _id: existingUser._id });
      user = existingUser;
    }
    if (!user.profile || overwrite) user.profile = profile;
    if (!user.first_name || overwrite) user.first_name = firstName;
    if (!user.last_name || overwrite) user.last_name = lastName;
    if (!user.email) user.email = email;
    if (!user.birthday) user.birthday = birthday;
    if (!user.birth_month) user.birth_month = birthMonth;
    if (!user.birth_month_day) user.birth_month_day = birthDayOfMonth;
    if (user.verified === false) user.verified = verified;
    if (user.done_registering == null) user.done_registering = false;
    fullName = (firstName && lastName ? `${firstName} ${lastName}` : 'An unknown user');
    writeLog.call({ userId: user._id, action: 'REGISTER', message: `${fullName} registered with email ${email}` }, logError);
    return user;
  });

  Accounts.validateLoginAttempt((parms) => {

    return true;
  });

  //TODO put fast render routes here
});
