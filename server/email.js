import { SITE_NAME } from '../imports/api/constants';

Accounts.emailTemplates.siteName = SITE_NAME;
Accounts.emailTemplates.from     = "Brian Duffey <bduff9@gmail.com>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return `[${SITE_NAME}] Verify Your Email Address`;
  },
  text(user, url) {
    let emailAddress   = user.email,
        urlWithoutHash = url.replace('#/', ''),
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;
    return emailBody;
  }
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return `[${SITE_NAME}] Reset Password Request`;
  },
  text(user, url) {
    let urlWithoutHash = url.replace('#/', '');
    return `To reset your password, simply click the link below:\n\n${urlWithoutHash}`;
  }
};
