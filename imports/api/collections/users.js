'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

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
