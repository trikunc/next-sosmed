const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
// const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require('crypto');
const baseUrl = require('../utils/baseUrl');
const isEmail = require('validator/lib/isEmail');

const images1 = require('../components/Email/images/logoblack.png');
const images2 = require('../components/Email/images/BusinessPlatform.jpg');
const { View } = require('grandjs');
const EmailConfirm = View.importJsx('./views/Newsletter.jsx');

const checkTimeNow = () => {
  const time = moment().format('HH');
  console.log('time-now=', time);
  if (time % 2 == 0) {
    return {
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER1,
        pass: process.env.SMTP_KEY1,
      },
    };
  } else {
    return {
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER2,
        pass: process.env.SMTP_KEY2,
      },
    };
  }
};

const transporter = nodemailer.createTransport(checkTimeNow());

// const options = {
//   auth: {
//     api_key: process.env.sendGrid_api
//   }
// };

// const transporter = nodemailer.createTransport(sendGridTransport(options));

// CHECK USER EXISTS AND SEND EMAIL FOR RESET PASSWORD
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!isEmail(email)) {
      return res.status(401).send('Invalid Email');
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');

    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;

    await user.save();

    const href = `${baseUrl}/reset/${token}`;

    const mailOptions = {
      to: user.email,
      // from: "singh.inder5880@gmail.com",
      from: 'septiana.trikuncoro@gmail.com',
      subject: 'Hi there! Password reset request',
      html: `<p>Hey ${user.name
        .split(' ')[0]
        .toString()}, There was a request for password reset. <a href=${href}>Click this link to reset the password </a>   </p>
      <p>This token is valid for only 1 hour.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => err && console.log(err));

    return res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// VERIFY THE TOKEN AND RESET THE PASSWORD IN DB

router.post('/token', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    if (password.length < 6)
      return res.status(401).send('Password must be atleast 6 characters');

    const user = await UserModel.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (Date.now() > user.expireToken) {
      return res.status(401).send('Token expired.Generate new one');
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetToken = '';
    user.expireToken = undefined;

    await user.save();

    return res.status(200).send('Password updated');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// SMP Web Contact Us
router.post('/smp', async (req, res) => {
  try {
    const { name, email, text } = req.body;

    let template = View.renderToHtml(EmailConfirm, { name });

    const mailOptions = {
      to: email,
      from: 'corporates@sinergimp.co.id',
      subject: 'Hi thank you for contacting Sinergi Merah Putih',
      html: template,
      // `
      // <p>Hey ${name} </p>
      // <p>Email ${email} </p>
      // <p>Text: ${text}</p>
      // `,
    };

    transporter.sendMail(mailOptions, (err, info) => err && console.log(err));

    return res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
