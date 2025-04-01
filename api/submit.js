const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { email, name } = req.body;
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com', // or 'smtp.gmail.com' if using Gmail
      port: 587,
      secure: false,
      auth: {
        user: 'clay@adinkra.studio',
        pass: process.env.ZOHO_PASSWORD // or GMAIL_PASSWORD
      }
    });

    // Send PDF to lead
    await transporter.sendMail({
      from: 'clay@adinkra.studio',
      to: email,
      subject: 'Your Custom Software Starter Kit',
      text: `Hi ${name || 'there'},\n\nThanks for grabbing the kit! Download it here: https://adinkra.studio/starter-kit.pdf\n\nWhat’s your next project? Reply or book a quick chat: clay@adinkra.studio\n\n- Clay`,
    });

    // Notify Clay
    await transporter.sendMail({
      from: 'clay@adinkra.studio',
      to: 'clay@adinkra.studio',
      subject: `New Lead: ${email}`,
      text: `Email: ${email}\nName: ${name || 'Not provided'}\nLead got the kit—follow up!`
    });

    res.status(200).json({ message: 'Success' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
