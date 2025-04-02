const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { email } = req.query;
  if (email) {
    // Log open to HubSpot
    await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          email_opened: 'Yes', // New property
          lead_score: '+10' // Adjust score (workflow will handle this)
        },
        email: email // Match contact
      })
    });
  }
  // Return 1x1 pixel
  res.setHeader('Content-Type', 'image/png');
  res.send(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/uhpXAAAAABJRU5ErkJggg==', 'base64'));
};
