const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nodemailer = require('nodemailer');
// const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require('crypto');
const baseUrl = require('../utils/baseUrl');
const isEmail = require('validator/lib/isEmail');

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
        user: process.env.SMTP_USER1,
        pass: process.env.SMTP_KEY1,
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

    const mailOptions = {
      to: email,
      from: 'corporates@sinergimp.co.id',
      subject: 'Hi thank you for contacting Sinergi Merah Putih',
      html:
        //       `
        //       <html lang="en">
        // <head>
        //     <meta charset="UTF-8">
        //     <meta http-equiv="X-UA-Compatible" content="IE=edge">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <title>Email</title>

        //     <link href="https://fonts.googleapis.com/css?family=Work+Sans:200,300,400,500,600,700" rel="stylesheet">
        //     <link rel="stylesheet" href="style.css">
        //     <script src="https://unpkg.com/feather-icons"></script>
        // </head>

        // <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
        //     <div style="width: 100%; background-color: #f1f1f1;">
        //         <div style="max-width: 600px; margin: 0 auto;" class="email-container">

        //             <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
        //                 <!-- LOGO -->
        //                 <tr>
        //                     <td valign="top" class="bg_white" style="padding: 1em 2.5em;">
        //                         <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        //                             <tr>
        //                                 <td class="logo">
        //                                     <img src="images/logoblack.png" alt="" height="40px" style="float: right;"></img>
        //                                 </td>
        //                             </tr>
        //                         </table>
        //                     </td>
        //                 </tr>

        //                 <!-- SINERGIMP -->
        //                 <tr>
        //                     <td valign="middle" class="hero bg_white"
        //                         style="background-image: url(images/BusinessPlatform.jpg); background-size: cover; height: 350px;">
        //                         <div class="overlay"></div>
        //                         <table>
        //                             <tr>
        //                                 <td>
        //                                     <div class="text" style="padding: 0 4em; text-align: center;">
        //                                         <h2>Sinergi Merah Putih</h2>
        //                                         <p>Enthusiastic, and high curiosity is the key to keep innovating. We will always be a partner to
        //                                             support you.</p><br>
        //                                         <p><a href="https://sinergimp1.vercel.app/" class="btn btn-primary">Read more</a></p>
        //                                     </div>
        //                                 </td>
        //                             </tr>
        //                         </table>
        //                     </td>
        //                 </tr>

        //                 <!-- MESSAGE -->
        //                 <tr>
        //                     <td valign="top" class="bg_white" style="padding: 3em 2.5em;">
        //                         <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        //                             <tr>
        //                                 <td class="logo">
        //                                     <h2>Hi, {name}</h2>
        //                                     <p>We have received your message and would like to thank you for writing to us. If your inquiry is urgent, please use
        //                                         the telephone number listed below to talk to one of our staff members.</p>
        //                                     <p>Otherwise, we will reply by email as soon as possible.</p>
        //                                     <p>In the meantime, make sure to follow us on <a href="https://www.linkedin.com/company/ptsinergimp/mycompany/">LinkedIn!</a> </p><br>
        //                                     <p>Talk to you soon, Sinergi Merah Putih.</p>
        //                                 </td>
        //                             </tr>
        //                         </table>
        //                     </td>
        //                 </tr>

        //                 <!-- CONTACT -->
        //                 <tr>
        //                     <td valign="top" class="bg_black" style="padding: 3em 2.5em;">
        //                         <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="color: white;">
        //                             <h4 style="color: white;">Contact Info</h4>
        //                             <tr>
        //                                 <td width="7%"><i class="size-small" data-feather="map-pin"></i></td>
        //                                 <td><h6 style="color: white;">Jl. Gatot Subroto Kav. 32-34, Kelurahan Kuningan Timur, Kecamatan Setia Budi, Jakarta Selatan , 12950 Gedung Patra Jasa
        //                                 Office Tower, Lantai 17 Ruang 1702-1704</h6></td>
        //                             </tr>
        //                             <tr>
        //                                 <td width="7%"><i class="size-small" data-feather="phone"></i></td>
        //                                 <td>
        //                                     <h6 style="color: white;">+62 21 52900252</h6>
        //                                 </td>
        //                             </tr>
        //                         </table>
        //                     </td>
        //                 </tr>

        //             </table>

        //             <div class="" style="text-align: center; margin: 10px;">
        //                 &copy; <span style="font-size: small;"> &nbsp PT. Sinergi Merah Putih 2021</span>
        //             </div>

        //         </div>
        //     </div>

        //     <script>
        //         feather.replace()
        //     </script>
        // </body>
        // </html>
        //       `,
        `
      <p>Hey ${name} </p>
      <p>Email ${email} </p>
      <p>Text: ${text}</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => err && console.log(err));
    console.log('Sent mail');
    return res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
