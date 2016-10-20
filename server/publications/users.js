'use strict';

import { Meteor } from 'meteor/meteor';

import { User } from '../../imports/api/schema';

// Publish all data about current user
Meteor.publish('userData', function() {
  let myUser;
  if (!this.userId) return this.ready();
  myUser = User.find(this.userId);
  if (myUser) return myUser;
  return this.ready();
});
