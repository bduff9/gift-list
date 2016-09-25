
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
  methods: {}
});

export const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  secured: true,
  fields: {
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
      validators: [{ type: 'minLength', param: 1 }]
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
  methods: {},
  indexes: {}
});

export const Holidays = new Mongo.collection('holidays');
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
  methods: {},
  indexes: {}
});
