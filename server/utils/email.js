// Email utility functions
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cv.website.notifications@gmail.com', // This would be replaced with a real email in production
    pass: 'app-password-here' // This would be replaced with a real app password in production
  }
});

// Send email notification to admin when new message is received
const sendNewMessageNotification = async (message) => {
  try {
    const mailOptions = {
      from: 'CV Website <cv.website.notifications@gmail.com>',
      to: 'ezzeldeen20052018@gmail.com',
      subject: 'New Message Received on Your CV Website',
      html: `
        <h2>New Message Received</h2>
        <p><strong>From:</strong> ${message.sender_name} (${message.sender_email})</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.content}</p>
        <p>Login to your admin dashboard to respond.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send email to message sender with admin's reply
const sendReplyToSender = async (message, reply) => {
  try {
    const mailOptions = {
      from: 'Ezzeldeen Mohamed <cv.website.notifications@gmail.com>',
      to: message.sender_email,
      subject: `Re: ${message.subject}`,
      html: `
        <h2>Response to Your Message</h2>
        <p>Hello ${message.sender_name},</p>
        <p>Thank you for contacting me. Here is my response to your message:</p>
        <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #4a148c; margin: 10px 0;">
          ${reply.content}
        </div>
        <p>Original message:</p>
        <div style="padding: 10px; background-color: #f9f9f9; border-left: 2px solid #ccc; margin: 10px 0; color: #666;">
          ${message.content}
        </div>
        <p>Best regards,<br>Ezzeldeen Mohamed</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reply email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending reply email:', error);
    return false;
  }
};

module.exports = {
  sendNewMessageNotification,
  sendReplyToSender
};
