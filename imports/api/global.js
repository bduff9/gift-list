/*jshint esversion: 6 */
'use strict';

export const displayError = (err, opts = { title: err && err.reason, type: 'danger' }) => {
  if (!err) return;
  if (!opts.title) opts.title = 'Missing error title!';
  Bert.alert(opts);
};

export const logError = (err) => {
  if (!err) return;
  console.error('Error from logError', err);
};

export const convertEpoch = (epoch) => {
  let d = new Date(0);
  d.setUTCSeconds(epoch);
  return d;
};

export const pad = (toPad, padWith = '0', ln) => {
  let padded = '' + toPad;
  while (padded.length < ln) padded = '' + padWith + padded;
  return padded;
};
