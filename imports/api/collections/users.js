'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { moment } from 'meteor/momentjs:moment';

import { getDayOfMonth, getMonth } from '../global';
import { User } from '../schema';

export const sendVerificationEmail = new ValidatedMethod({
  name: 'User.resend',
  validate: null,
  run() {
    if (!this.userId) throw new Meteor.Error('User.resend.notLoggedIn', 'Must be logged in to resend verification email');
    if (Meteor.isServer) {
      Accounts.sendVerificationEmail(this.userId);
    }
  }
});

export const updateUser = new ValidatedMethod({
  name: 'User.update',
  validate: new SimpleSchema({
    birthday: { type: String, label: 'Date of Birth' },
    firstName: { type: String, label: 'First Name' },
    lastName: { type: String, label: 'Last Name' },
    password: { type: String, label: 'Password', min: 6 }
  }).validator(),
  run({ birthday, firstName, lastName, password }) {
    let profile = { name: `${firstName} ${lastName}` },
        user, birthDt, birthMonth, birthDayOfMonth;
    if (!this.userId) throw new Meteor.Error('User.update.notLoggedIn', 'Must be logged in to update user profile');
    if (Meteor.isServer) {
      Accounts.setPassword(this.userId, password, { logout: false });
      user = User.findOne(this.userId);
      birthDt = moment(birthday).toDate();
      birthMonth = getMonth(birthday);
      birthDayOfMonth = getDayOfMonth(birthday);
      user.profile = profile;
      user.first_name = firstName;
      user.last_name = lastName;
      user.birthday = birthDt;
      user.birth_month = birthMonth;
      user.birth_month_day = birthDayOfMonth;
      user.save();
    }
  }
});
