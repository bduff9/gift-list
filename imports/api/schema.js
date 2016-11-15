
/*jshint esversion: 6 */
'use strict';

import { Meteor } from 'meteor/meteor';
import { Class, Validator } from 'meteor/jagi:astronomy';
import { moment } from 'meteor/momentjs:moment';

import { ACTIONS } from './constants';

// Custom validators
Validator.create({
  name: 'isChild',
  isValid({ doc, value }) {
    const { is_child } = doc;
    if (!is_child && value.length === 0) return true;
    if (is_child && value.length > 0) return true;
    return false;
  },
  resolveError: () => 'Children must have at least 1 parent, non-children cannot have any'
});

// Collections
export const Notification = Class.create({
  name: 'Notification',
  secured: true,
  fields: {
    //TODO fill in notification key/values
  },
  helpers: {}
});

export const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  secured: true,
  fields: {
    createdAt: {
      type: Date
    },
    services: {
      type: Object
    },
    profile: {
      type: Object
    },
    status: {
      type: Object
    },
    email: {
      type: String,
      validators: [{ type: 'email' }],
      optional: true
    },
    first_name: {
      type: String,
      validators: [{ type: 'minLength', param: 1 }]
    },
    last_name: {
      type: String,
      validators: [{ type: 'minLength', param: 1 }]
    },
    birthday: {
      type: Date
    },
    birth_month: {
      type: Number,
      validators: [{ type: 'and', param: [{ type: 'gte', param: 1 }, { type: 'lte', param: 12 }] }]
    },
    birth_month_day: {
      type: Number,
      validators: [{ type: 'and', param: [{ type: 'gte', param: 1 }, { type: 'lte', param: 31 }] }]
    },
    verified: Boolean,
    done_registering: Boolean,
    is_child: {
      type: Boolean,
      default: false
    },
    child_links: {
      type: [String],
      default: () => []
    },
    parent_links: {
      type: [String],
      default: () => [],
      validators: [{ type: 'isChild' }]
    },
    family_ids: {
      type: [String],
      validators: [{ type: 'minLength', param: 1 }],
      optional: true
    },
    admin_family_ids: {
      type: [String],
      default: () => []
    },
    shopping_list: {
      type: [String],
      default: () => []
    },
    notifications: {
      type: Notification,
      default: () => {}
    }
  },
  helpers: {},
  indexes: {}
});

export const Holidays = new Mongo.Collection('holidays');
export const Holiday = Class.create({
  name: 'Holiday',
  collection: Holidays,
  secured: true,
  fields: {
    name: {
      type: String
    },
    date: {
      type: Date
    },
    last_updated: {
      type: Date,
      default: () => new Date()
    }
  },
  helpers: {},
  indexes: {}
});

export const Families = new Mongo.Collection('families');
export const Family = Class.create({
  name: 'Family',
  collection: Families,
  secured: true,
  fields: {
    name: {
      type: String
    },
    location: {
      type: String
    },
    active: {
      type: Boolean
    }
  },
  helpers: {},
  indexes: {}
});

export const Gifts = new Mongo.Collection('gifts');
export const Gift = Class.create({
  name: 'Gift',
  collection: Gifts,
  secured: true,
  fields: {
    name: {
      type: String,
      validators: [{ type: 'minLength', param: 3 }]
    },
    descr: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    },
    location: {
      type: String
    },
    link: {
      type: String
    },
    picture: {
      type: String
    },
    notes: {
      type: String
    },
    for_id: {
      type: String
    },
    priority: {
      type: Number,
      validators: [{ type: 'gte', param: 1 }],
      optional: true
    },
    suggested_by_id: {
      type: String,
      optional: true
    },
    purchased_by_id: {
      type: String,
      optional: true
    },
    asked_for: {
      type: Boolean
    },
    on_user_list: {
      type: String,
      optional: true
    }
  },
  helpers: {},
  indexes: {}
});

export const Logs = new Mongo.Collection('logs');
export const Log = Class.create({
  name: 'Log',
  collection: Logs,
  secured: true,
  fields: {
    date: {
      type: Date
    },
    action: {
      type: String,
      validators: [{ type: 'choice', param: ACTIONS }]
    },
    message: {
      type: String
    },
    user_id: {
      type: String,
      optional: true
    }
  },
  helpers: {},
  indexes: {}
});

export const SystemVals = new Mongo.Collection('system');
export const System = Class.create({
  name: 'System',
  collection: SystemVals,
  secured: true,
  fields: {
    current_connections: {
      type: Object,
      default: () => {}
    }
  },
  helpers: {},
  indexes: {}
});
