module.exports = async (req, res) => {
  console.log('PDF downloaded:', req.query);
  res.redirect(302, 'https://adinkra.studio/starter-kit.pdf');
};
