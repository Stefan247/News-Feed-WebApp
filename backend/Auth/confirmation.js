const User = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv/config');


const send_confirmation_mail  = (address_from , registered_user) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SERVER_MAIL,
            pass: process.env.SERVER_PASS
        }
    });

    let mailOptions = {
        from: process.env.SERVER_MAIL,
        to: registered_user.email,
        subject: 'New account confirmation',
        text:`Hello ${registered_user.username}, 

            Click on the link to activate your account:
            http://${address_from}/users/signup/verify-email?token=${registered_user.email_token}

            This link will expire in 15 minutes.
            You will automatically receive another one, if this one is expired.

            Thank you,
            PW_Stefan_Project.
           `
    }
    transporter.sendMail(mailOptions);
}

module.exports = { send_confirmation_mail };
