// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

const sendEmail = async(options) => {
  // Create transporter (email sender Service) //Gmail
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Define email options (from : , to : , Subject : , Content : )
  const mailOptions = {
    from: "E-Shop <darabiemohammad@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
