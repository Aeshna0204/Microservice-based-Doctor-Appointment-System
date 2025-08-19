const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY);

const { createClient } = require('redis')

const app = express();
app.use(express.json());

// app.post('/send', async (req, res) => {
//   const { to, subject, text } = req.body;

//   if (!to || !subject || !text) {
//     return res.status(400).json({ message: 'Missing fields' });
//   }

//   try {
//     await sgMail.send({
//       to,
//       from: process.env.FROM_EMAIL,
//       subject,
//       text,
//     });

//     res.status(200).json({ message: 'Email sent!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed', error: err.message });
//   }
// });




// async communication with user service to send the mail
(async () => {
  try {
    const subscriber = createClient({ url: 'redis://redis:6379' }); // 'redis' is the Docker service name
    await subscriber.connect();
    console.log('📡 Mailer Service connected to Redis');

    await subscriber.subscribe('send_email_channel', async (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'send_email') {
          await sgMail.send({
            to: data.to,
            from: process.env.FROM_EMAIL,
            subject: data.subject,
            text: data.text,
          });
          console.log(`📧 Async email sent to ${data.to}`);
        }
      } catch (err) {
        console.error(' Error sending async email:', err);
        return res.status(500).json({ message: 'Failed to send email', error: err.message });
        
      }
    });
  } catch (err) {
    console.error(' Redis connection error:', err);
    // return res.status(500).json({ message: 'Redis connection error', error: err.message });
  }
})();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mailer-service running on port ${PORT}`));
