'use strict';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { logError } from '../imports/api/global';

const gmailUrl = Meteor.settings.private.gmail;

Meteor.startup(() => {
  process.env.MAIL_URL = gmailUrl;

  Meteor.onConnection((conn) => {
    const systemVal = SystemVal.findOne();
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
    })
  });

  Accounts.onCreateUser((options, user) => {
    const currentWeekSync = Meteor.wrapAsync(currentWeek.call, currentWeek),
        currWeek = currentWeekSync(),
        EMPTY_VAL = '';
    let first_name = EMPTY_VAL,
        last_name = EMPTY_VAL,
        email = EMPTY_VAL,
        verified = true,
        existingCount, firstName, lastName, logEntry, bonusTeam;
    if (currWeek > 3) throw new Meteor.Error('Registration has ended', 'No new users are allowed after the third week.  Please try again next year');
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
    user.team_name = EMPTY_VAL;
    user.referred_by = EMPTY_VAL;
    user.verified = verified;
    user.done_registering = false;
    user.paid = false;
    user.selected_week = {};
    user.total_points = 0;
    user.total_games = 0;
    user.bonus_points = 0;
    user.picks = Game.find({}, { sort: { week: 1, game: 1 }}).map(game => {
      let bonusTeam = Team.findOne({ short_name: 'BON' });
      return {
        "week": game.week,
        "game_id": game._id,
        "game": game.game,
        "pick_id": (game.game === 0 ? bonusTeam._id : undefined),
        "pick_short": (game.game === 0 ? bonusTeam.short_name : undefined)
      };
    });
    user.tiebreakers = Game.find({ game: 1 }, { sort: { week: 1 }}).map(game => {
      return {
        "week": game.week
      };
    });
    user.survivor = Game.find({ game: 1 }, { sort: { week: 1 }}).map(game => {
      return {
        "week": game.week
      };
    });
    firstName = first_name || 'An unknown';
    lastName = last_name || 'user';
    writeLog.call({ userId: user._id, action: 'REGISTER', message: `${firstName} ${lastName} registered with email ${email}` }, logError);
    return user;
  });

  Accounts.validateLoginAttempt((parms) => {
    const { allowed, methodName, user } = parms;
    let verified = false,
        vEmails, logEntry;
    if (methodName === 'createUser' && parms.user) {
      Accounts.sendVerificationEmail(parms.user._id);
      return false;
    }
    if (user && !user.verified) {
      vEmails = user.emails.filter(email => email.verified);
      if (vEmails.length === 0) {
        // Should we also re-send the verification email here?
        throw new Meteor.Error('Email not verified!', 'Please check your email to verify your account');
        return false;
      } else {
        Meteor.users.update({ _id: user._id }, { $set: { verified: true }});
      }
    }
    return true;
  });
});
