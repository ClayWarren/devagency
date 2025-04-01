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

    // Send PDF email with Calendly
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com', // or 'smtp.gmail.com'
      port: 587,
      secure: false,
      auth: {
        user: 'clay@adinkra.studio',
        pass: process.env.ZOHO_PASSWORD
      }
    });
    await transporter.sendMail({
      from: 'clay@adinkra.studio',
      to: email,
      subject: 'Your Custom Software Starter Kit',
      html: `Hi ${name || 'there'},<br><br>Thanks for grabbing the kit! Download it here: <a href="https://adinkra.studio/starter-kit.pdf" onclick="gtag('event', 'pdf_download', {'event_category': 'Lead', 'event_label': 'Free Kit PDF'});">Click here</a><br><br>Book a quick chat: <a href="https://calendly.com/clay-adinkra/15min">https://calendly.com/clay-adinkra/15min</a><br><br>- Clay`
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
