//pour générer la clé secrète
const crypto = require('crypto');

const genererCleSecrete = () => {
  return crypto.randomBytes(32).toString('hex');
};

const PORT = process.env.PORT || 5000

module.exports = {
  cleSecrete: genererCleSecrete(),
  PORT
};
