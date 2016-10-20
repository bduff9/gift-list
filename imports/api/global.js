/*jshint esversion: 6 */
'use strict';

import { moment } from 'meteor/momentjs:moment';

export const displayError = (err, opts = { title: err && err.reason, type: 'danger' }) => {
  if (!err) return;
  if (!opts.title) opts.title = 'Missing error title!';
  Bert.alert(opts);
};

export const logError = (err) => {
  if (!err) return;
  console.error('Error from logError', err);
};

export const getAge = (bdayStr) => {
  const INVALID = 'N/A',
    TODAY = moment();
  let bday, age;
  if (bdayStr) {
    bday = moment(bdayStr);
    if (bday.isValid()) return TODAY.diff(bday, 'years');
  }
  return INVALID;
};

export const pad = (toPad, padWith = '0', ln) => {
  let padded = '' + toPad;
  while (padded.length < ln) padded = '' + padWith + padded;
  return padded;
};

export const getMonth = dt => {
  const d = moment(dt);
  let m;
  if (!dt) return;
  m = parseInt(d.format('M'), 10);
  return m;
};

export const getDayOfMonth = dt => {
  const d = moment(dt);
  let dy;
  if (!dt) return;
  dy = parseInt(d.format('D'), 10);
  return dy;
};
