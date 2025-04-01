const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { email, name } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: 'hello@adinkra.studio',
        pass: process.env.ZOHO_PASSWORD
      }
    });

    await transporter.sendMail({
      from: 'hello@adinkra.studio',
      to: 'hello@adinkra.studio',
      subject: `New Lead: ${email}`,
      text: `Email: ${email}\nName: ${name || 'Not provided'}\nReply with the kit!`
    });

    res.status(200).json({ message: 'Success' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
