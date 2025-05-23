const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { email, name } = req.body;

    // Log to HubSpot
    const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const hubspotData = {
      properties: {
        email: email,
        firstname: name || '',
        lifecyclestage: 'lead'
      }
    };
    await fetch(hubspotUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hubspotData)
    });

    // Send PDF email with tracking pixel
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com', // or 'smtp.gmail.com'
      port: 587,
      secure: false,
      auth: {
        user: 'clay@adinkra.studio',
        pass: process.env.ZOHO_PASSWORD
      }
    });
    const trackingPixel = `<img src="https://adinkra.studio/api/track-open?email=${encodeURIComponent(email)}" width="1" height="1" style="display:none">`;
    await transporter.sendMail({
      from: 'clay@adinkra.studio',
      to: email,
      subject: 'Your Custom Software Starter Kit',
      html: `Hi ${name || 'there'},<br><br>Thanks for grabbing the kit! Download it here: <a href="https://adinkra.studio/api/track?email=${encodeURIComponent(email)}">Click here</a><br><br>Book a quick chat: <a href="https://calendly.com/claydertot3/30min">https://calendly.com/claydertot3/30min</a><br><br>- Clay${trackingPixel}`
    });
    await transporter.sendMail({
      from: 'clay@adinkra.studio',
      to: 'clay@adinkra.studio',
      subject: `New Lead: ${email}`,
      text: `Email: ${email}\nName: ${name || 'Not provided'}\nLogged in HubSpot—follow up!`
    });

    res.status(200).json({ message: 'Success', email: email });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
